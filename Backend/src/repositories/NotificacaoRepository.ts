import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export class NotificacaoRepository {
  async buscarParaUsuario(usuarioId: number) {
    const notificacoes = [];
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    const dataLimiteFatura = new Date();
    dataLimiteFatura.setDate(hoje.getDate() + 5);

    const faturas = await prisma.fatura.findMany({
      where: {
        cartaoCredito: { usuarioId },
        estaPaga: false,
        dataVencimento: { gte: hoje, lte: dataLimiteFatura },
      },
      include: { cartaoCredito: true },
    });

    for (const f of faturas) {
      notificacoes.push({
        id: `fat-${f.id}`,
        titulo: "Fatura Próxima",
        mensagem: `A fatura do ${f.cartaoCredito.nome} vence dia ${f.dataVencimento.toLocaleDateString()}`,
        tipo: "warning",
      });
    }

    const orcamentos = await prisma.orcamento.findMany({
      where: { usuarioId, mes: mesAtual, ano: anoAtual },
      include: { categoria: true },
    });

    for (const o of orcamentos) {
      const transacoesDiretas = await prisma.transacao.findMany({
        where: {
          categoriaId: o.categoriaId,
          tipo: "DESPESA",
          formaPagamento: { not: "CREDITO" },
          data: {
            gte: new Date(anoAtual, mesAtual - 1, 1),
            lt: new Date(anoAtual, mesAtual, 1),
          },
        },
      });
      const gastoDireto = transacoesDiretas.reduce(
        (acc, t) => acc + t.valor,
        0,
      );

      const parcelasDoMes = await prisma.parcela.findMany({
        where: {
          fatura: { mes: mesAtual, ano: anoAtual },
          transacao: { categoriaId: o.categoriaId },
        },
      });
      const gastoParcelado = parcelasDoMes.reduce((acc, p) => acc + p.valor, 0);

      const gastoTotal = gastoDireto + gastoParcelado;
      const percentual =
        o.valorPlanejado > 0 ? (gastoTotal / o.valorPlanejado) * 100 : 0;

      if (percentual >= 90) {
        notificacoes.push({
          id: `orc-${o.id}`,
          titulo: "Orçamento Atingido",
          mensagem: `A categoria ${o.categoria.nome} atingiu ${percentual.toFixed(0)}% do limite.`,
          tipo: "danger",
        });
      }
    }

    return notificacoes;
  }
}
