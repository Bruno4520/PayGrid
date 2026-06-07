import {
  TipoTransacao,
  FormaPagamento,
  TipoConta,
} from "../../generated/prisma/index.js";

const getDateOffset = (days: number) => {
  const date = new Date("2026-6-25");
  date.setDate(date.getDate() - days);
  return date;
};

export async function populateUser(tx: any, usuarioId: number) {
  const categoriasExtras = [
    {
      nome: "Educação",
      icone: "education",
      cor: "bg-cyan-500",
      sistema: false,
    },
    {
      nome: "Investimentos",
      icone: "trending-up",
      cor: "bg-green-600",
      sistema: false,
    },
    {
      nome: "Assinaturas",
      icone: "energy",
      cor: "bg-yellow-500",
      sistema: false,
    },
  ];

  await tx.categoria.createMany({
    data: categoriasExtras.map((c) => ({ ...c, usuarioId })),
  });

  const todasCategorias = await tx.categoria.findMany({ where: { usuarioId } });

  const getCatId = (nome: string) =>
    todasCategorias.find((c: any) => c.nome === nome)?.id;

  const contas = await Promise.all([
    tx.conta.create({
      data: {
        nome: "Itaú Corrente",
        saldo: 4500.0,
        tipo: TipoConta.CONTA_CORRENTE,
        numeroConta: "1111-2",
        agencia: "0001",
        usuarioId,
      },
    }),
    tx.conta.create({
      data: {
        nome: "Reserva Emergência",
        saldo: 12000.0,
        tipo: TipoConta.POUPANCA,
        numeroConta: "2222-3",
        agencia: "0001",
        usuarioId,
      },
    }),
    tx.conta.create({
      data: {
        nome: "Carteira",
        saldo: 250.0,
        tipo: TipoConta.CARTEIRA,
        numeroConta: "0000-0",
        agencia: "0000",
        usuarioId,
      },
    }),
  ]);

  const cartoes = await Promise.all([
    tx.cartaoCredito.create({
      data: {
        nome: "Nubank Ultravioleta",
        limite: 10000.0,
        diaFechamentoFatura: 25,
        diaVencimentoFatura: 5,
        ultimosDigitos: "4444",
        usuarioId,
      },
    }),
    tx.cartaoCredito.create({
      data: {
        nome: "Itaú Platinum",
        limite: 5000.0,
        diaFechamentoFatura: 10,
        diaVencimentoFatura: 20,
        ultimosDigitos: "8888",
        usuarioId,
      },
    }),
  ]);

  const contaCorrente = contas[0];
  const catAlimentacao = getCatId("Alimentação");
  const catMoradia = getCatId("Moradia");
  const catLazer = getCatId("Lazer");
  const catAssinaturas = getCatId("Assinaturas");

  if (catMoradia && catAlimentacao) {
    await tx.orcamento.createMany({
      data: [
        {
          valorPlanejado: 2000,
          mes: new Date().getMonth() + 1,
          ano: new Date().getFullYear(),
          categoriaId: catMoradia,
          usuarioId,
        },
        {
          valorPlanejado: 800,
          mes: new Date().getMonth() + 1,
          ano: new Date().getFullYear(),
          categoriaId: catAlimentacao,
          usuarioId,
        },
      ],
    });
  }

  const transacoes = [
    {
      descricao: "Salário Mensal",
      valor: 5500.0,
      tipo: TipoTransacao.RECEITA,
      formaPagamento: FormaPagamento.PIX,
      contaId: contaCorrente.id,
      categoriaId: getCatId("Investimentos"),
      data: getDateOffset(30),
    },
    {
      descricao: "Aluguel",
      valor: 1800.0,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.PIX,
      contaId: contaCorrente.id,
      categoriaId: catMoradia,
      data: getDateOffset(25),
    },
    {
      descricao: "Supermercado",
      valor: 450.0,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.DEBITO,
      contaId: contaCorrente.id,
      categoriaId: catAlimentacao,
      data: getDateOffset(20),
    },
    {
      descricao: "Netflix",
      valor: 55.9,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.CREDITO,
      cartaoCreditoId: cartoes[0].id,
      categoriaId: catAssinaturas,
      data: getDateOffset(15),
    },
    {
      descricao: "Jantar Restaurante",
      valor: 120.0,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.CREDITO,
      cartaoCreditoId: cartoes[0].id,
      categoriaId: catLazer,
      data: getDateOffset(10),
    },
    {
      descricao: "Gasolina",
      valor: 200.0,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.PIX,
      contaId: contaCorrente.id,
      categoriaId: getCatId("Transporte"),
      data: getDateOffset(5),
    },
    {
      descricao: "Compra na Amazon",
      valor: 800.0,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.CREDITO,
      cartaoCreditoId: cartoes[1].id,
      categoriaId: getCatId("Outros"),
      data: getDateOffset(2),
    },
  ];

  for (const t of transacoes) {
    if (t.formaPagamento === "CREDITO") {
      const { contaId, ...rest } = t;
      await tx.transacao.create({ data: rest });
    } else {
      await tx.transacao.create({ data: t });
    }
  }
}
