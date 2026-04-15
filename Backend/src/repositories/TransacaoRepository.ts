import { PrismaClient, type Transacao, type FormaPagamento, type TipoTransacao } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

interface DadosCriarTransacao {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    formaPagamento: FormaPagamento;
    contaId: number;
    categoriaId?: number;
    observacoes?: string;
}

interface DadosCompraCredito
    extends Omit<DadosCriarTransacao, "contaId" | "formaPagamento" | "tipo"> {
    cartaoCreditoId: number;
    numeroParcelas: number;
}

interface DadosAtualizarTransacao extends Omit<DadosCriarTransacao, 'formaPagamento'> { }

interface DadosAtualizarCompraCredito extends DadosCompraCredito { }

export class TransacaoRepository {
    async criar(dados: DadosCriarTransacao) {
        return prisma.$transaction(async (tx) => {
            const transacao = await tx.transacao.create({ data: dados });

            const valorAtualizacao =
                dados.tipo === "RECEITA" ? dados.valor : -dados.valor;

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

    async criarCompraCredito(dados: DadosCompraCredito, cartao: { diaFechamentoFatura: number; diaVencimentoFatura: number }) {
        return prisma.$transaction(async (tx) => {
            const transacao = await tx.transacao.create({
                data: {
                    descricao: dados.descricao,
                    valor: dados.valor,
                    tipo: "DESPESA",
                    formaPagamento: "CREDITO",
                    categoriaId: dados.categoriaId || null,
                    cartaoCreditoId: dados.cartaoCreditoId,
                    observacoes: dados.observacoes || null,
                },
            });

            const valorParcela = parseFloat(
                (dados.valor / dados.numeroParcelas).toFixed(2)
            );

            for (let i = 1; i <= dados.numeroParcelas; i++) {
                const dataCompra = new Date();

                let mesFatura = dataCompra.getMonth();
                let anoFatura = dataCompra.getFullYear();

                if (dataCompra.getDate() >= cartao.diaFechamentoFatura) mesFatura++;

                mesFatura += (i - 1);

                anoFatura += Math.floor(mesFatura / 12);
                mesFatura = mesFatura % 12;

                const dataVencimentoFatura = new Date(
                    anoFatura,
                    mesFatura + 1,
                    cartao.diaVencimentoFatura
                );

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
                    data: { valorTotal: { increment: valorParcela } },
                });
            }
            return transacao;
        });
    }

    async buscarPorId(id: number) {
        return prisma.transacao.findUnique({
            where: { id },
        });
    }

    async deletar(transacao: Transacao) {
        return prisma.$transaction(async (tx) => {
            if (transacao.contaId) {
                const valorDeletado =
                    transacao.tipo === "RECEITA" ? -transacao.valor : transacao.valor;

                await tx.conta.update({
                    where: { id: transacao.contaId },
                    data: {
                        saldo: {
                            increment: valorDeletado,
                        },
                    },
                });
            }

            await tx.transacao.delete({
                where: { id: transacao.id },
            });
        });
    }

    async deletarCredito(transacaoId: number) {
        return prisma.$transaction(async (tx) => {
            const parcelas = await tx.parcela.findMany({
                where: { transacaoId: transacaoId },
                select: { faturaId: true, valor: true },
            });

            for (const parcela of parcelas) {
                await tx.fatura.update({
                    where: { id: parcela.faturaId },
                    data: {
                        valorTotal: {
                            decrement: parcela.valor,
                        },
                    },
                });
            }

            await tx.transacao.delete({
                where: { id: transacaoId },
            });
        });
    }

    async buscarTodasPorContaId(contaId: number) {
        return prisma.transacao.findMany({
            where: { contaId },
            orderBy: { data: "desc" },
        });
    }

    async atualizar(transacaoAntiga: Transacao, novosDados: DadosAtualizarTransacao) {
        return prisma.$transaction(async (tx) => {
            if (transacaoAntiga.contaId) {
                const valorAntigo = transacaoAntiga.tipo === 'RECEITA' ? -transacaoAntiga.valor : transacaoAntiga.valor;
                await tx.conta.update({
                    where: { id: transacaoAntiga.contaId },
                    data: { saldo: { increment: valorAntigo } },
                });
            }

            if (novosDados.contaId) {
                const valorNovo = novosDados.tipo === 'RECEITA' ? novosDados.valor : -novosDados.valor;
                await tx.conta.update({
                    where: { id: novosDados.contaId },
                    data: { saldo: { increment: valorNovo } },
                });
            }

            return tx.transacao.update({
                where: { id: transacaoAntiga.id },
                data: {
                    descricao: novosDados.descricao,
                    valor: novosDados.valor,
                    tipo: novosDados.tipo,
                    contaId: novosDados.contaId || null,
                    categoriaId: novosDados.categoriaId || null,
                    observacoes: novosDados.observacoes || null,
                },
            });
        });
    }

    async atualizarCredito(transacaoAntiga: Transacao, novosDados: DadosAtualizarCompraCredito, cartao: any) {
        return prisma.$transaction(async (tx) => {
            const parcelas = await tx.parcela.findMany({
                where: { transacaoId: transacaoAntiga.id },
                select: { faturaId: true, valor: true }
            });

            for (const parcela of parcelas) {
                await tx.fatura.update({
                    where: { id: parcela.faturaId },
                    data: {
                        valorTotal: {
                            decrement: parcela.valor,
                        },
                    },
                });
            }

            await tx.parcela.deleteMany({ where: { transacaoId: transacaoAntiga.id } });

            const valorParcela = parseFloat((novosDados.valor / novosDados.numeroParcelas).toFixed(2));

            for (let i = 1; i <= novosDados.numeroParcelas; i++) {
                const dataCompra = new Date(transacaoAntiga.data);

                let mesFatura = dataCompra.getMonth();
                let anoFatura = dataCompra.getFullYear();

                if (dataCompra.getDate() >= cartao.diaFechamentoFatura) mesFatura++;

                mesFatura += (i - 1);

                anoFatura += Math.floor(mesFatura / 12);
                mesFatura = mesFatura % 12;

                const dataVencimentoFatura = new Date(anoFatura, mesFatura + 1, cartao.diaVencimentoFatura);

                const fatura = await tx.fatura.upsert({
                    where: { cartaoCreditoId_mes_ano: { cartaoCreditoId: novosDados.cartaoCreditoId, mes: mesFatura + 1, ano: anoFatura } },
                    update: {},
                    create: { mes: mesFatura + 1, ano: anoFatura, valorTotal: 0, dataVencimento: dataVencimentoFatura, cartaoCreditoId: novosDados.cartaoCreditoId }
                });

                await tx.parcela.create({
                    data: { numeroParcela: i, valor: valorParcela, transacaoId: transacaoAntiga.id, faturaId: fatura.id }
                });

                await tx.fatura.update({
                    where: { id: fatura.id },
                    data: { valorTotal: { increment: valorParcela } }
                });
            }

            return tx.transacao.update({
                where: { id: transacaoAntiga.id },
                data: {
                    descricao: novosDados.descricao,
                    valor: novosDados.valor,
                    categoriaId: novosDados.categoriaId || null,
                    cartaoCreditoId: novosDados.cartaoCreditoId,
                    observacoes: novosDados.observacoes || null,
                }
            });
        });
    }
}
