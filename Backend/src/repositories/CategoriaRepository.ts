import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface DadosCriarCategoria {
  nome: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  usuarioId: number;
  observacoes?: string;
}

interface DadosAtualizarCategoria {
  nome?: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  observacoes?: string;
}

export class CategoriaRepository {
  async criar(dados: DadosCriarCategoria) {
    return prisma.categoria.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao || null,
        cor: dados.cor || null,
        icone: dados.icone || null,
        usuarioId: dados.usuarioId,
        observacoes: dados.observacoes || null,
      },
    });
  }

  async buscarTodasPorUsuarioId(usuarioId: number) {
    return prisma.categoria.findMany({
      where: { usuarioId },
      orderBy: { nome: "asc" },
    });
  }

  async buscarPorIdEUsuarioId(id: number, usuarioId: number) {
    return prisma.categoria.findUnique({
      where: { id, usuarioId },
    });
  }

  async buscarCategoriaFatura(usuarioId: number) {
    return prisma.categoria.findFirst({
      where: { nome: "PAGAMENTO DE FATURA", usuarioId, sistema: true },
    });
  }

  async atualizar(id: number, dados: DadosAtualizarCategoria) {
    return prisma.categoria.update({
      where: { id },
      data: dados,
    });
  }

  async deletar(id: number) {
    return prisma.$transaction(async (tx) => {
      await tx.orcamento.deleteMany({
        where: { categoriaId: id },
      });
      return tx.categoria.delete({
        where: { id },
      });
    });
  }
}
