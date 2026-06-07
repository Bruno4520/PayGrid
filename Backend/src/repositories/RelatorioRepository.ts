import { PrismaClient, Prisma } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type FonteFiltro = { contas?: number[]; cartoes?: number[] };

const buildBaseWhere = (
  usuarioId: number,
  fonte?: FonteFiltro,
): Prisma.TransacaoWhereInput => {
  const baseWhere: Prisma.TransacaoWhereInput = {
    OR: [
      { categoriaId: null },
      { categoria: { nome: { not: "PAGAMENTO DE FATURA" } } },
    ],
  };

  if (fonte && (fonte.contas?.length || fonte.cartoes?.length)) {
    const orConditions = [];
    if (fonte.contas?.length) {
      orConditions.push({ contaId: { in: fonte.contas } });
    }
    if (fonte.cartoes?.length) {
      orConditions.push({ cartaoCreditoId: { in: fonte.cartoes } });
    }
    baseWhere.AND = [{ OR: orConditions }];
  } else {
    baseWhere.AND = [
      { OR: [{ conta: { usuarioId } }, { cartaoCredito: { usuarioId } }] },
    ];
  }

  return baseWhere;
};

export class RelatorioRepository {
  async obterResumo(
    usuarioId: number,
    dataInicio: Date,
    dataFim: Date,
    fonte?: FonteFiltro,
  ) {
    const where: Prisma.TransacaoWhereInput = {
      ...buildBaseWhere(usuarioId, fonte),
      data: { gte: dataInicio, lte: dataFim },
    };

    const transacoes = await prisma.transacao.groupBy({
      by: ["tipo"],
      where,
      _sum: { valor: true },
    });

    let receitas = 0;
    let despesas = 0;

    transacoes.forEach((t) => {
      if (t.tipo === "RECEITA") receitas = t._sum?.valor || 0;
      if (t.tipo === "DESPESA") despesas = t._sum?.valor || 0;
    });

    return { receitas, despesas, saldo: receitas - despesas };
  }

  async obterDespesasPorCategoria(
    usuarioId: number,
    dataInicio: Date,
    dataFim: Date,
    fonte?: FonteFiltro,
  ) {
    const where: Prisma.TransacaoWhereInput = {
      ...buildBaseWhere(usuarioId, fonte),
      tipo: "DESPESA",
      data: { gte: dataInicio, lte: dataFim },
    };

    const agrupado = await prisma.transacao.groupBy({
      by: ["categoriaId"],
      where,
      _sum: { valor: true },
      orderBy: { _sum: { valor: "desc" } },
    });

    const categorias = await prisma.categoria.findMany({
      where: { usuarioId },
    });

    return agrupado.map((item) => {
      const cat = categorias.find((c) => c.id === item.categoriaId);
      return {
        id: item.categoriaId ? String(item.categoriaId) : "sem-categoria",
        name: cat ? cat.nome : "Sem Categoria",
        value: item._sum.valor || 0,
        color:
          cat && cat.cor ? this.mapCorDoTailwindParaHex(cat.cor) : "#71717A",
      };
    });
  }

  private mapCorDoTailwindParaHex(corTailwind: string): string {
    const mapaCores: Record<string, string> = {
      "bg-blue-500": "#3B82F6",
      "bg-emerald-500": "#10B981",
      "bg-purple-500": "#A855F7",
      "bg-red-500": "#EF4444",
      "bg-orange-500": "#F97316",
      "bg-yellow-500": "#EAB308",
      "bg-pink-500": "#EC4899",
      "bg-zinc-500": "#71717A",
    };
    return mapaCores[corTailwind] || "#71717A";
  }

  async obterEvolucaoDinamicamente(
    usuarioId: number,
    dataInicio: Date,
    dataFim: Date,
    fonte?: FonteFiltro,
  ) {
    const where: Prisma.TransacaoWhereInput = {
      ...buildBaseWhere(usuarioId, fonte),
      data: { gte: dataInicio, lte: dataFim },
    };

    const transacoes = await prisma.transacao.findMany({
      where,
      select: { valor: true, tipo: true, data: true },
      orderBy: { data: "asc" },
    });

    const diffDias = Math.ceil(
      (dataFim.getTime() - dataInicio.getTime()) / (1000 * 3600 * 24),
    );
    const isDiario = diffDias <= 35;

    const mapEvolucao = new Map();

    if (isDiario) {
      for (
        let d = new Date(dataInicio);
        d <= dataFim;
        d.setDate(d.getDate() + 1)
      ) {
        const key = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
        mapEvolucao.set(key, {
          label: key,
          receitas: 0,
          despesas: 0,
          saldo: 0,
        });
      }
    } else {
      const nomeMeses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      const d = new Date(dataInicio);
      d.setDate(1);
      while (
        d <= dataFim ||
        (d.getMonth() === dataFim.getMonth() &&
          d.getFullYear() === dataFim.getFullYear())
      ) {
        const key = `${nomeMeses[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
        mapEvolucao.set(key, {
          label: key,
          receitas: 0,
          despesas: 0,
          saldo: 0,
        });
        d.setMonth(d.getMonth() + 1);
      }
    }

    transacoes.forEach((t) => {
      const d = new Date(t.data);
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

      let key = "";
      if (isDiario) {
        key = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      } else {
        const nomeMeses = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];
        key = `${nomeMeses[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
      }

      if (mapEvolucao.has(key)) {
        const item = mapEvolucao.get(key);
        if (t.tipo === "RECEITA") item.receitas += t.valor;
        if (t.tipo === "DESPESA") item.despesas += t.valor;
        item.saldo = item.receitas - item.despesas;
      }
    });

    return Array.from(mapEvolucao.values());
  }
}
