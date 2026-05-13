import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface DadosCriarCartao {
  nome: string;
  limite: number;
  diaFechamentoFatura: number;
  diaVencimentoFatura: number;
  usuarioId: number;
  ultimosDigitos?: string;
}

interface DadosAtualizarCartao {
  nome?: string;
  limite?: number;
  diaFechamentoFatura?: number;
  diaVencimentoFatura?: number;
  ultimosDigitos?: string;
}

export class CartaoCreditoRepository {
  async criar(dados: DadosCriarCartao) {
    return prisma.cartaoCredito.create({
      data: {
        nome: dados.nome,
        limite: dados.limite,
        diaFechamentoFatura: dados.diaFechamentoFatura,
        diaVencimentoFatura: dados.diaVencimentoFatura,
        usuarioId: dados.usuarioId,
        ultimosDigitos: dados.ultimosDigitos || "",
      },
    });
  }

  async buscarTodosPorUsuarioId(usuarioId: number) {
    return prisma.cartaoCredito.findMany({
      where: { usuarioId },
      orderBy: { nome: "asc" },
    });
  }

  async buscarPorIdEUsuarioId(id: number, usuarioId: number) {
    return prisma.cartaoCredito.findUnique({
      where: { id, usuarioId },
    });
  }

  async buscarFaturasPorCartaoId(id: number) {
    return prisma.cartaoCredito.findUnique({
      where: { id },
      include: {
        faturas: {
          orderBy: [{ ano: "desc" }, { mes: "desc" }],
          include: {
            parcelas: true,
          },
        },
      },
    });
  }

  async atualizar(id: number, dados: DadosAtualizarCartao) {
    return prisma.cartaoCredito.update({
      where: { id },
      data: dados,
    });
  }

  async deletar(id: number) {
    return prisma.cartaoCredito.delete({
      where: { id },
    });
  }
}
