import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface DadosCriarCategoria {
  nome: string;
  descricao?: string;
  usuarioId: number;
  observacoes?: string;
}

interface DadosAtualizarCategoria {
  nome?: string;
  descricao?: string;
  observacoes?: string;
}

export class CategoriaRepository {
  async criar(dados: DadosCriarCategoria) {
    return prisma.categoria.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao || null,
        usuarioId: dados.usuarioId,
        observacoes: dados.observacoes || null,
      },
    });
  }

  async buscarTodasPorUsuarioId(usuarioId: number) {
    return prisma.categoria.findMany({
      where: {
        usuarioId,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async buscarPorIdEUsuarioId(id: number, usuarioId: number) {
    return prisma.categoria.findUnique({
      where: {
        id,
        usuarioId,
      },
    });
  }

  async buscarCategoriaFatura(usuarioId: number) {
    return prisma.categoria.findFirst({
      where: { nome: "PAGAMENTO DE FATURA", usuarioId, sistema: true },
    });
  }

  async atualizar(id: number, dados: DadosAtualizarCategoria) {
    return prisma.categoria.update({
      where: {
        id,
      },
      data: dados,
    });
  }

  async deletar(id: number) {
    return prisma.categoria.delete({
      where: {
        id,
      },
    });
  }

  async temOrcamentos(categoriaId: number): Promise<boolean> {
    const orcamento = await prisma.orcamento.findFirst({
      where: { categoriaId: categoriaId },
      select: { id: true },
    });
    return !!orcamento;
  }
}
