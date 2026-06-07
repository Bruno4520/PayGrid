import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface DadosOrcamento {
  valorPlanejado: number;
  mes: number;
  ano: number;
  categoriaId: number;
  usuarioId: number;
}

export class OrcamentoRepository {
  async definir(dados: DadosOrcamento) {
    return prisma.orcamento.upsert({
      where: {
        usuarioId_categoriaId_mes_ano: {
          usuarioId: dados.usuarioId,
          categoriaId: dados.categoriaId,
          mes: dados.mes,
          ano: dados.ano,
        },
      },
      update: { valorPlanejado: dados.valorPlanejado },
      create: dados,
    });
  }

  async buscarOrcamentosDoMes(usuarioId: number, mes: number, ano: number) {
    const categorias = await prisma.categoria.findMany({
      where: {
        usuarioId,
        sistema: false,
      },
      orderBy: { nome: "asc" },
    });

    const orcamentos = await prisma.orcamento.findMany({
      where: { usuarioId, mes, ano },
    });

    const resultado = await Promise.all(
      categorias.map(async (cat) => {
        const orcamento = orcamentos.find((o) => o.categoriaId === cat.id);
        const dataInicio = new Date(ano, mes - 1, 1);
        const dataFim = new Date(ano, mes, 0, 23, 59, 59);

        const transacoesAVista = await prisma.transacao.aggregate({
          _sum: { valor: true },
          where: {
            categoriaId: cat.id,
            tipo: "DESPESA",
            formaPagamento: { not: "CREDITO" },
            data: { gte: dataInicio, lte: dataFim },
            faturaPaga: null,
          },
        });

        const parcelas = await prisma.parcela.aggregate({
          _sum: { valor: true },
          where: {
            transacao: { categoriaId: cat.id },
            fatura: { mes: mes, ano: ano },
          },
        });

        const gastoTotal =
          (transacoesAVista._sum.valor || 0) + (parcelas._sum.valor || 0);

        return {
          categoria: cat,
          orcamento: orcamento || null,
          gastoAtual: gastoTotal,
        };
      }),
    );

    return resultado;
  }

  async deletar(
    usuarioId: number,
    categoriaId: number,
    mes: number,
    ano: number,
  ) {
    return prisma.orcamento.delete({
      where: {
        usuarioId_categoriaId_mes_ano: {
          usuarioId,
          categoriaId,
          mes,
          ano,
        },
      },
    });
  }
}
