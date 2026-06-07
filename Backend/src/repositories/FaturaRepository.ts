import { PrismaClient, type Fatura } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface DadosPagarFatura {
  fatura: Fatura;
  contaId: number;
  categoriaId: number;
}

export class FaturaRepository {
  async buscarPorIdEUsuarioId(faturaId: number, usuarioId: number) {
    return prisma.fatura.findFirst({
      where: {
        id: faturaId,
        cartaoCredito: {
          usuarioId: usuarioId,
        },
      },
    });
  }

  async pagar(dados: DadosPagarFatura) {
    return prisma.$transaction(async (tx) => {
      const transacao = await tx.transacao.create({
        data: {
          descricao: `Pagamento fatura do cartão - ${dados.fatura.mes}/${dados.fatura.ano}`,
          valor: dados.fatura.valorTotal,
          tipo: "DESPESA",
          formaPagamento: "DEBITO",
          contaId: dados.contaId,
          categoriaId: dados.categoriaId,
        },
      });

      const faturaPaga = await tx.fatura.update({
        where: { id: dados.fatura.id },
        data: {
          estaPaga: true,
          transacaoPagamentoId: transacao.id,
        },
      });

      await tx.conta.update({
        where: { id: dados.contaId },
        data: { saldo: { decrement: dados.fatura.valorTotal } },
      });

      return faturaPaga;
    });
  }

  async buscarTodasPorUsuario(usuarioId: number) {
    return prisma.fatura.findMany({
      where: {
        cartaoCredito: {
          usuarioId: usuarioId,
        },
      },
      include: {
        cartaoCredito: {
          select: {
            nome: true,
          },
        },
        parcelas: {
          include: {
            transacao: {
              include: {
                categoria: true,
              },
            },
          },
        },
      },
      orderBy: [{ ano: "desc" }, { mes: "desc" }],
    });
  }
}
