import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export class DashboardRepository {
  async obterResumo(usuarioId: number) {
    const hoje = new Date();
    const seisMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);

    const contas = await prisma.conta.findMany({ where: { usuarioId } });
    const saldoTotal = contas.reduce((acc, c) => acc + c.saldo, 0);

    const cartoes = await prisma.cartaoCredito.findMany({
      where: { usuarioId },
      include: { faturas: { where: { estaPaga: false } } },
    });
    const limiteTotal = cartoes.reduce((acc, c) => acc + c.limite, 0);
    const limiteUsado = cartoes.reduce(
      (acc, c) => acc + c.faturas.reduce((sum, f) => sum + f.valorTotal, 0),
      0,
    );

    const transacoesRecentes = await prisma.transacao.findMany({
      where: {
        OR: [{ conta: { usuarioId } }, { cartaoCredito: { usuarioId } }],
      },
      include: {
        categoria: true,
        conta: true,
        cartaoCredito: true,
        parcelas: true,
      },
      orderBy: [{ data: "desc" }, { id: "desc" }],
      take: 5,
    });

    const totalTransacoes = await prisma.transacao.count({
      where: {
        OR: [{ conta: { usuarioId } }, { cartaoCredito: { usuarioId } }],
      },
    });

    let receitasMesAtual = 0;
    let despesasMesAtual = 0;
    const despesasPorCategoriaMap: Record<string, number> = {};
    const graficoMensalMap: Record<
      string,
      { receitas: number; despesas: number }
    > = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesChave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      graficoMensalMap[mesChave] = { receitas: 0, despesas: 0 };
    }

    const mesAtualChave = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;

    const transacoesAVista = await prisma.transacao.findMany({
      where: {
        conta: { usuarioId },
        formaPagamento: { not: "CREDITO" },
        data: { gte: seisMesesAtras },
        faturaPaga: null,
      },
      include: { categoria: true },
    });

    transacoesAVista.forEach((t) => {
      const dataTx = new Date(t.data);
      const mesChave = `${dataTx.getFullYear()}-${String(dataTx.getMonth() + 1).padStart(2, "0")}`;

      if (graficoMensalMap[mesChave]) {
        if (t.tipo === "RECEITA")
          graficoMensalMap[mesChave].receitas += t.valor;
        if (t.tipo === "DESPESA")
          graficoMensalMap[mesChave].despesas += t.valor;
      }

      if (mesChave === mesAtualChave) {
        if (t.tipo === "RECEITA") receitasMesAtual += t.valor;
        if (t.tipo === "DESPESA") {
          despesasMesAtual += t.valor;
          const catNome = t.categoria?.nome || "Outros";
          despesasPorCategoriaMap[catNome] =
            (despesasPorCategoriaMap[catNome] || 0) + t.valor;
        }
      }
    });

    const faturas = await prisma.fatura.findMany({
      where: { cartaoCredito: { usuarioId } },
      include: {
        parcelas: { include: { transacao: { include: { categoria: true } } } },
      },
    });

    faturas.forEach((fatura) => {
      const mesChave = `${fatura.ano}-${String(fatura.mes).padStart(2, "0")}`;

      fatura.parcelas.forEach((parcela) => {
        if (graficoMensalMap[mesChave]) {
          graficoMensalMap[mesChave].despesas += parcela.valor;
        }

        if (mesChave === mesAtualChave) {
          despesasMesAtual += parcela.valor;
          const catNome = parcela.transacao.categoria?.nome || "Outros";
          despesasPorCategoriaMap[catNome] =
            (despesasPorCategoriaMap[catNome] || 0) + parcela.valor;
        }
      });
    });

    const monthNames = [
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

    const graficoMensal = Object.entries(graficoMensalMap)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, valores]) => ({
        month: monthNames[Number(key.split("-")[1]) - 1],
        receitas: valores.receitas,
        despesas: valores.despesas,
      }));

    const cores = [
      "#3B82F6",
      "#10B981",
      "#EC4899",
      "#F59E0B",
      "#8B5CF6",
      "#14B8A6",
      "#F43F5E",
    ];
    const graficoCategorias = Object.entries(despesasPorCategoriaMap)
      .map(([name, value], index) => ({
        id: name,
        name,
        value,
        color: cores[index % cores.length],
      }))
      .sort((a, b) => b.value - a.value);

    return {
      saldoTotal,
      receitasMesAtual,
      despesasMesAtual,
      limiteTotal,
      limiteUsado,
      totalTransacoes,
      transacoesRecentes,
      graficoMensal,
      graficoCategorias,
    };
  }
}
