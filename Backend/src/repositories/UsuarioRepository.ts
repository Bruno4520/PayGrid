import argon2 from "argon2";
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIAS_BASICAS = [
  {
    nome: "Moradia",
    descricao: "Despesas com aluguel, condomínio, etc.",
    sistema: false,
  },
  {
    nome: "Alimentação",
    descricao: "Compras de supermercado, restaurantes, delivery.",
    sistema: false,
  },
  {
    nome: "Transporte",
    descricao: "Combustível, transporte público, Uber.",
    sistema: false,
  },
  {
    nome: "Salário",
    descricao: "Recebimento de salário ou pagamento.",
    sistema: false,
  },
  {
    nome: "PAGAMENTO DE FATURA",
    descricao: "Pagamento de fatura do cartão.",
    sistema: true,
  },
];

export class UsuarioRepository {
  async criar(dadosUsuario: any) {
    const senhaHash = await argon2.hash(dadosUsuario.senha);
    return prisma.$transaction(async (tx) => {
      const novoUsuario = await prisma.usuario.create({
        data: {
          nome: dadosUsuario.nome,
          email: dadosUsuario.email,
          senha: senhaHash,
        },
        select: {
          id: true,
          nome: true,
          email: true,
        },
      });

      const categoriasBasicas = CATEGORIAS_BASICAS.map((categoria) => ({
        ...categoria,
        usuarioId: novoUsuario.id,
      }));

      await tx.categoria.createMany({
        data: categoriasBasicas,
      });

      return novoUsuario;
    });
  }

  async buscarPorEmail(email: string) {
    return prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });
  }

  async buscarPorId(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
  }
}
