import { PrismaClient, type FormaPagamento, type TipoTransacao } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

interface DadosCriarTransacao {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    formaPagamento: FormaPagamento;
    contaId: number;
    categoriaId: number;
}

interface DadosCompraCredito extends Omit<DadosCriarTransacao, 'contaId' | 'formaPagamento' | 'tipo'> {
    cartaoCreditoId: number;
    numeroParcelas: number;
}

export class TransacaoRepository {

    async criar(dados: DadosCriarTransacao) {
        return prisma.$transaction(async (tx) => {
            const transacao = await tx.transacao.create({ data: dados });

            const valorAtualizacao = dados.tipo === 'RECEITA' ? dados.valor : -dados.valor;

            await tx.conta.update({
                where: { id: dados.contaId },
                data: {
                    saldo: {
                        increment: valorAtualizacao,
                    },
                },
            });

            return transacao;
        });
    }

    async criarCompraCredito(dados: DadosCompraCredito, cartao: { diaFechamentoFatura: number, diaVencimentoFatura: number }) {
        return prisma.$transaction(async (tx) => {
            const transacao = await tx.transacao.create({
                data: {
                    descricao: dados.descricao,
                    valor: dados.valor,
                    tipo: 'DESPESA',
                    formaPagamento: 'CREDITO',
                    contaId: 1,
                    categoriaId: dados.categoriaId,
                    cartaoCreditoId: dados.cartaoCreditoId,
                },
            });

            const valorParcela = parseFloat((dados.valor / dados.numeroParcelas).toFixed(2));

            for (let i = 1; i <= dados.numeroParcelas; i++) {
                const dataCompra = new Date();

                let mesFatura = dataCompra.getMonth();
                let anoFatura = dataCompra.getFullYear();

                if (dataCompra.getDate() >= cartao.diaFechamentoFatura) {
                    mesFatura++;
                }

                mesFatura += (i - 1);

                anoFatura += Math.floor(mesFatura / 12);
                mesFatura = mesFatura % 12;

                const dataVencimentoFatura = new Date(anoFatura, mesFatura + 1, cartao.diaVencimentoFatura);

                const fatura = await tx.fatura.upsert({
                    where: {
                        cartaoCreditoId_mes_ano: {
                            cartaoCreditoId: dados.cartaoCreditoId,
                            mes: mesFatura + 1,
                            ano: anoFatura,
                        },
                    },
                    update: {},
                    create: {
                        mes: mesFatura + 1,
                        ano: anoFatura,
                        valorTotal: 0,
                        dataVencimento: dataVencimentoFatura,
                        cartaoCreditoId: dados.cartaoCreditoId,
                    },
                });

                await tx.parcela.create({
                    data: {
                        numeroParcela: i,
                        valor: valorParcela,
                        transacaoId: transacao.id,
                        faturaId: fatura.id,
                    },
                });

                await tx.fatura.update({
                    where: { id: fatura.id },
                    data: { valorTotal: { increment: valorParcela } }
                });
            }
            return transacao;
        });
    }

    async buscarTodasPorContaId(contaId: number) {
        return prisma.transacao.findMany({
            where: { contaId },
            orderBy: { data: 'desc' },
        });
    }
}