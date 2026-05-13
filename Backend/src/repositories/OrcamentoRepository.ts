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

  async buscarTodosPorUsuarioId(usuarioId: number) {
    return prisma.orcamento.findMany({
      where: { usuarioId },
      include: {
        categoria: {
          select: { nome: true },
        },
      },
      orderBy: [{ ano: "desc" }, { mes: "desc" }],
    });
  }

  async calcularGastoAtual(orcamento: {
    categoriaId: number;
    mes: number;
    ano: number;
  }) {
    const dataInicio = new Date(orcamento.ano, orcamento.mes - 1, 1);
    const dataFim = new Date(orcamento.ano, orcamento.mes, 0);

    const resultado = await prisma.transacao.aggregate({
      _sum: {
        valor: true,
      },
      where: {
        categoriaId: orcamento.categoriaId,
        tipo: "DESPESA",
        data: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
    });

    return resultado._sum.valor || 0;
  }
}
