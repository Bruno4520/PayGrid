import {
  PrismaClient,
  type Transacao,
  type FormaPagamento,
  type TipoTransacao,
} from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface DadosCriarTransacao {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  formaPagamento: FormaPagamento;
  contaId: number;
  categoriaId?: number;
  observacoes?: string;
  data: Date | string;
}

interface DadosCompraCredito extends Omit<
  DadosCriarTransacao,
  "contaId" | "formaPagamento" | "tipo"
> {
  cartaoCreditoId: number;
  numeroParcelas: number;
}

interface DadosAtualizarTransacao extends DadosCriarTransacao {}
interface DadosAtualizarCompraCredito extends DadosCompraCredito {}

interface CartaoBase {
  diaFechamentoFatura: number;
  diaVencimentoFatura: number;
}

export class TransacaoRepository {
  async buscarTodasPorUsuarioId(usuarioId: number) {
    return prisma.transacao.findMany({
      where: {
        OR: [{ conta: { usuarioId } }, { cartaoCredito: { usuarioId } }],
      },
      include: {
        conta: true,
        cartaoCredito: true,
        categoria: true,
        parcelas: true,
      },
      orderBy: { data: "desc" },
    });
  }

  async criar(dados: DadosCriarTransacao) {
    return prisma.$transaction(async (tx) => {
      const transacao = await tx.transacao.create({
        data: {
          descricao: dados.descricao,
          valor: dados.valor,
          tipo: dados.tipo,
          formaPagamento: dados.formaPagamento,
          contaId: dados.contaId,
          categoriaId: dados.categoriaId || null,
          observacoes: dados.observacoes || null,
          data: new Date(dados.data),
        },
      });

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

  async criarCompraCredito(dados: DadosCompraCredito, cartao: CartaoBase) {
    return prisma.$transaction(
      async (tx) => {
        const transacao = await tx.transacao.create({
          data: {
            descricao: dados.descricao,
            valor: dados.valor,
            tipo: "DESPESA",
            formaPagamento: "CREDITO",
            categoriaId: dados.categoriaId || null,
            cartaoCreditoId: dados.cartaoCreditoId,
            observacoes: dados.observacoes || null,
            data: new Date(dados.data),
          },
        });

        const valorParcela = parseFloat(
          (dados.valor / dados.numeroParcelas).toFixed(2),
        );

        for (let i = 1; i <= dados.numeroParcelas; i++) {
          const dataCompra = new Date(dados.data);

          let mesFatura = dataCompra.getMonth();
          let anoFatura = dataCompra.getFullYear();

          if (dataCompra.getDate() >= cartao.diaFechamentoFatura) mesFatura++;

          mesFatura += i - 1;

          anoFatura += Math.floor(mesFatura / 12);
          mesFatura = mesFatura % 12;

          const dataVencimentoFatura = new Date(
            anoFatura,
            mesFatura + 1,
            cartao.diaVencimentoFatura,
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
      },
      {
        maxWait: 5000,
        timeout: 15000,
      },
    );
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

      const faturasAfetadas = new Set<number>();

      for (const parcela of parcelas) {
        await tx.fatura.update({
          where: { id: parcela.faturaId },
          data: {
            valorTotal: {
              decrement: parcela.valor,
            },
          },
        });
        faturasAfetadas.add(parcela.faturaId);
      }

      await tx.transacao.delete({
        where: { id: transacaoId },
      });

      for (const faturaId of faturasAfetadas) {
        const qtdParcelas = await tx.parcela.count({
          where: { faturaId },
        });

        if (qtdParcelas === 0) {
          await tx.fatura.delete({
            where: { id: faturaId },
          });
        }
      }
    });
  }

  async buscarTodasPorContaId(contaId: number) {
    return prisma.transacao.findMany({
      where: { contaId },
      orderBy: { data: "desc" },
    });
  }

  async atualizar(
    transacaoAntiga: Transacao,
    novosDados: DadosAtualizarTransacao,
  ) {
    return prisma.$transaction(async (tx) => {
      if (transacaoAntiga.contaId) {
        const valorAntigo =
          transacaoAntiga.tipo === "RECEITA"
            ? -transacaoAntiga.valor
            : transacaoAntiga.valor;
        await tx.conta.update({
          where: { id: transacaoAntiga.contaId },
          data: { saldo: { increment: valorAntigo } },
        });
      }

      if (novosDados.contaId) {
        const valorNovo =
          novosDados.tipo === "RECEITA" ? novosDados.valor : -novosDados.valor;
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
          formaPagamento: novosDados.formaPagamento,
          contaId: novosDados.contaId || null,
          categoriaId: novosDados.categoriaId || null,
          observacoes: novosDados.observacoes || null,
          data: novosDados.data
            ? new Date(novosDados.data)
            : transacaoAntiga.data,
        },
      });
    });
  }

  async atualizarCredito(
    transacaoAntiga: Transacao,
    novosDados: DadosAtualizarCompraCredito,
    cartao: CartaoBase,
  ) {
    return prisma.$transaction(
      async (tx) => {
        const parcelas = await tx.parcela.findMany({
          where: { transacaoId: transacaoAntiga.id },
          select: { faturaId: true, valor: true },
        });

        const faturasAfetadas = new Set<number>();

        for (const parcela of parcelas) {
          await tx.fatura.update({
            where: { id: parcela.faturaId },
            data: {
              valorTotal: {
                decrement: parcela.valor,
              },
            },
          });
          faturasAfetadas.add(parcela.faturaId);
        }

        await tx.parcela.deleteMany({
          where: { transacaoId: transacaoAntiga.id },
        });

        for (const faturaId of faturasAfetadas) {
          const qtdParcelas = await tx.parcela.count({
            where: { faturaId },
          });

          if (qtdParcelas === 0) {
            await tx.fatura.delete({
              where: { id: faturaId },
            });
          }
        }

        const valorParcela = parseFloat(
          (novosDados.valor / novosDados.numeroParcelas).toFixed(2),
        );

        for (let i = 1; i <= novosDados.numeroParcelas; i++) {
          const dataCompra = novosDados.data
            ? new Date(novosDados.data)
            : new Date(transacaoAntiga.data);

          let mesFatura = dataCompra.getMonth();
          let anoFatura = dataCompra.getFullYear();

          if (dataCompra.getDate() >= cartao.diaFechamentoFatura) mesFatura++;

          mesFatura += i - 1;
          anoFatura += Math.floor(mesFatura / 12);
          mesFatura = mesFatura % 12;

          const dataVencimentoFatura = new Date(
            anoFatura,
            mesFatura + 1,
            cartao.diaVencimentoFatura,
          );

          const fatura = await tx.fatura.upsert({
            where: {
              cartaoCreditoId_mes_ano: {
                cartaoCreditoId: novosDados.cartaoCreditoId,
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
              cartaoCreditoId: novosDados.cartaoCreditoId,
            },
          });

          await tx.parcela.create({
            data: {
              numeroParcela: i,
              valor: valorParcela,
              transacaoId: transacaoAntiga.id,
              faturaId: fatura.id,
            },
          });

          await tx.fatura.update({
            where: { id: fatura.id },
            data: { valorTotal: { increment: valorParcela } },
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
            data: novosDados.data
              ? new Date(novosDados.data)
              : transacaoAntiga.data,
          },
        });
      },
      {
        maxWait: 10000,
        timeout: 40000,
      },
    );
  }
}
