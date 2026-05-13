import { PrismaClient, type Simulacao } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type DadosCriarSimulacao = Omit<Simulacao, "id" | "dataSimulacao">;

export class SimulacaoRepository {
  async salvar(dados: DadosCriarSimulacao) {
    return prisma.simulacao.create({
      data: dados,
    });
  }

  async buscarTodasPorUsuarioId(usuarioId: number) {
    return prisma.simulacao.findMany({
      where: { usuarioId },
      orderBy: { dataSimulacao: "desc" },
    });
  }
}
