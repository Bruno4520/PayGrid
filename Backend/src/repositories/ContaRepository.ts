import { PrismaClient, type TipoConta } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface DadosCriarConta {
  nome: string;
  saldo: number;
  tipo: TipoConta;
  usuarioId: number;
  numeroConta?: string;
  agencia?: string;
}

interface DadosAtualizarConta {
  nome?: string;
  saldo?: number;
  tipo?: TipoConta;
  numeroConta?: string;
  agencia?: string;
}

export class ContaRepository {
  async criar(dados: DadosCriarConta) {
    return prisma.conta.create({
      data: {
        nome: dados.nome,
        saldo: dados.saldo,
        tipo: dados.tipo,
        usuarioId: dados.usuarioId,
        numeroConta: dados.numeroConta ?? "",
        agencia: dados.agencia ?? "",
      },
    });
  }

  async buscarTodasPorUsuarioId(usuarioId: number) {
    return prisma.conta.findMany({
      where: { usuarioId },
      orderBy: { nome: "asc" },
    });
  }

  async buscarPorIdEUsuarioId(id: number, usuarioId: number) {
    return prisma.conta.findUnique({ where: { id, usuarioId } });
  }

  async atualizar(id: number, dados: DadosAtualizarConta) {
    return prisma.conta.update({ where: { id }, data: dados });
  }

  async deletar(id: number) {
    return prisma.conta.delete({ where: { id } });
  }
}
