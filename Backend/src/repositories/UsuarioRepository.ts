import argon2 from "argon2";
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { populateUser } from "../services/SeedService.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIAS_BASICAS = [
  { nome: "Moradia", icone: "home", cor: "bg-blue-500", sistema: false },
  { nome: "Alimentação", icone: "food", cor: "bg-emerald-500", sistema: false },
  { nome: "Transporte", icone: "car", cor: "bg-orange-500", sistema: false },
  { nome: "Saúde", icone: "health", cor: "bg-red-500", sistema: false },
  {
    nome: "Lazer",
    icone: "entertainment",
    cor: "bg-purple-500",
    sistema: false,
  },
  {
    nome: "PAGAMENTO DE FATURA",
    icone: "other",
    cor: "bg-zinc-500",
    sistema: true,
  },
];

export class UsuarioRepository {
  async criar(
    dados: { nome: string; email: string; senha: string },
    popularComDadosTeste: boolean = false,
  ) {
    const senhaHash = await argon2.hash(dados.senha);

    return prisma.$transaction(
      async (tx) => {
        const usuario = await tx.usuario.create({
          data: {
            nome: dados.nome,
            email: dados.email,
            senha: senhaHash,
          },
          select: { id: true, nome: true, email: true },
        });

        const categorias = CATEGORIAS_BASICAS.map((c) => ({
          ...c,
          usuarioId: usuario.id,
        }));

        await tx.categoria.createMany({ data: categorias });

        if (popularComDadosTeste) {
          await populateUser(tx, usuario.id);
        }

        return usuario;
      },
      {
        maxWait: 10000,
        timeout: 60000,
      },
    );
  }

  async buscarPorEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  }

  async buscarPorId(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nome: true, email: true },
    });
  }

  async buscarPorIdComSenha(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  async atualizarNome(id: number, nome: string) {
    return prisma.usuario.update({
      where: { id },
      data: { nome },
    });
  }

  async atualizarSenha(id: number, senhaHash: string) {
    return prisma.usuario.update({
      where: { id },
      data: { senha: senhaHash },
    });
  }

  async deletar(id: number) {
    return prisma.usuario.delete({ where: { id } });
  }
}
