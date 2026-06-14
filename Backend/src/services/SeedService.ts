import {
  TipoTransacao,
  FormaPagamento,
  TipoConta,
} from "../../generated/prisma/index.js";

export async function populateUser(tx: any, usuarioId: number) {
  try {
    // CATEGORIAS
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
        nome: "Salário",
        icone: "briefcase",
        cor: "bg-emerald-600",
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

    const todasCategorias = await tx.categoria.findMany({
      where: { usuarioId },
    });
    const getCatId = (palavrasChave: string[]) => {
      const cat = todasCategorias.find((c: any) =>
        palavrasChave.some((kw) => c.nome.toLowerCase().includes(kw)),
      );
      return cat?.id;
    };

    const catSalario = getCatId(["salário", "renda"]);
    const catMoradia = getCatId(["moradia", "aluguel"]);
    const catAlimentacao = getCatId(["alimentação", "comida"]);
    const catTransporte = getCatId(["transporte"]);
    const catLazer = getCatId(["lazer", "assinaturas"]);
    const catSaude = getCatId(["saúde"]);
    const catOutros = getCatId(["outros", "investimentos"]);

    // CONTAS
    const contaNubank = await tx.conta.create({
      data: {
        usuarioId,
        nome: "Nubank Corrente",
        saldo: 0,
        tipo: TipoConta.CONTA_CORRENTE,
        agencia: "0001",
        numeroConta: "123456-7",
      },
    });

    const contaCaixa = await tx.conta.create({
      data: {
        usuarioId,
        nome: "Caixa (Reserva)",
        saldo: 0,
        tipo: TipoConta.POUPANCA,
        agencia: "0145",
        numeroConta: "98765-4",
      },
    });

    const contaCarteira = await tx.conta.create({
      data: {
        usuarioId,
        nome: "Carteira Física",
        saldo: 0,
        tipo: TipoConta.CARTEIRA,
        agencia: "",
        numeroConta: "",
      },
    });

    // CARTÕES
    const cartaoNubank = await tx.cartaoCredito.create({
      data: {
        usuarioId,
        nome: "Nubank",
        limite: 2600,
        diaFechamentoFatura: 30,
        diaVencimentoFatura: 6,
        ultimosDigitos: "4321",
      },
    });

    const cartaoItau = await tx.cartaoCredito.create({
      data: {
        usuarioId,
        nome: "Itaú",
        limite: 1500,
        diaFechamentoFatura: 20,
        diaVencimentoFatura: 27,
        ultimosDigitos: "9090",
      },
    });

    async function criarTransacao(dados: any) {
      await tx.transacao.create({ data: dados });
      if (dados.contaId) {
        const valorAtualizacao =
          dados.tipo === "RECEITA" ? dados.valor : -dados.valor;
        await tx.conta.update({
          where: { id: dados.contaId },
          data: { saldo: { increment: valorAtualizacao } },
        });
      }
    }

    async function criarTransferencia(
      dados: any,
      contaOrigemId: number,
      contaDestinoId: number,
    ) {
      await criarTransacao({
        ...dados,
        tipo: TipoTransacao.DESPESA,
        contaId: contaOrigemId,
      });
      await criarTransacao({
        ...dados,
        descricao: `Transferência: ${dados.descricao}`,
        tipo: TipoTransacao.RECEITA,
        contaId: contaDestinoId,
      });
    }

    async function criarCredito(dados: any, cartao: any) {
      const transacao = await tx.transacao.create({
        data: {
          descricao: dados.descricao,
          valor: dados.valor,
          tipo: TipoTransacao.DESPESA,
          formaPagamento: FormaPagamento.CREDITO,
          categoriaId: dados.categoriaId,
          cartaoCreditoId: cartao.id,
          data: dados.data,
        },
      });

      const valorParcela = parseFloat(
        (dados.valor / dados.numeroParcelas).toFixed(2),
      );
      for (let i = 1; i <= dados.numeroParcelas; i++) {
        const dataCompra = new Date(dados.data);
        let mesFatura = dataCompra.getMonth();
        let anoFatura = dataCompra.getFullYear();

        if (dataCompra.getDate() >= cartao.diaFechamentoFatura) mesFatura++;
        mesFatura += i - 1;
        anoFatura += Math.floor(mesFatura / 12);
        mesFatura = mesFatura % 12;

        const dataVencimentoFatura = new Date(
          anoFatura,
          mesFatura + 1,
          cartao.diaVencimentoFatura,
        );

        const fatura = await tx.fatura.upsert({
          where: {
            cartaoCreditoId_mes_ano: {
              cartaoCreditoId: cartao.id,
              mes: mesFatura + 1,
              ano: anoFatura,
            },
          },
          update: {},
          create: {
            mes: mesFatura + 1,
            ano: anoFatura,
            valorTotal: 0,
            dataVencimento: dataVencimentoFatura,
            cartaoCreditoId: cartao.id,
          },
        });

        await tx.parcela.create({
          data: {
            numeroParcela: i,
            valor: valorParcela,
            transacaoId: transacao.id,
            faturaId: fatura.id,
          },
        });

        await tx.fatura.update({
          where: { id: fatura.id },
          data: { valorTotal: { increment: valorParcela } },
        });
      }
    }

    async function pagarFatura(
      cartaoId: number,
      mes: number,
      ano: number,
      contaOrigemId: number,
      dataPagamento: Date,
    ) {
      const fatura = await tx.fatura.findUnique({
        where: {
          cartaoCreditoId_mes_ano: {
            cartaoCreditoId: cartaoId,
            mes,
            ano,
          },
        },
      });

      if (!fatura || fatura.estaPaga) return;

      const catPagFatura = todasCategorias.find(
        (c: any) => c.sistema && c.nome === "PAGAMENTO DE FATURA",
      )?.id;

      const transacaoPagamento = await tx.transacao.create({
        data: {
          descricao: `Pagamento fatura do cartão - ${mes}/${ano}`,
          valor: fatura.valorTotal,
          tipo: TipoTransacao.DESPESA,
          formaPagamento: FormaPagamento.DEBITO,
          contaId: contaOrigemId,
          categoriaId: catPagFatura,
          data: dataPagamento,
        },
      });

      await tx.conta.update({
        where: { id: contaOrigemId },
        data: { saldo: { decrement: fatura.valorTotal } },
      });

      await tx.fatura.update({
        where: { id: fatura.id },
        data: {
          estaPaga: true,
          transacaoPagamentoId: transacaoPagamento.id,
        },
      });
    }

    const getDataRelativa = (
      mesOffset: number,
      dia: number,
      hora: number,
      minuto: number,
    ) => {
      const data = new Date();
      let targetMonth = data.getMonth() + mesOffset;
      let targetYear = data.getFullYear();

      while (targetMonth < 0) {
        targetMonth += 12;
        targetYear--;
      }
      while (targetMonth > 11) {
        targetMonth -= 12;
        targetYear++;
      }

      const diasNoMes = new Date(targetYear, targetMonth + 1, 0).getDate();
      const diaCorrigido = Math.min(dia, diasNoMes);

      return new Date(targetYear, targetMonth, diaCorrigido, hora, minuto, 0);
    };

    const getDataDiasAtras = (dias: number, hora: number, minuto: number) => {
      const data = new Date();
      data.setDate(data.getDate() - dias);
      data.setHours(hora, minuto, 0, 0);
      return data;
    };

    const dataFaturaAnterior = getDataRelativa(-1, 15, 0, 0);
    const mesFaturaPassada = dataFaturaAnterior.getMonth() + 1;
    const anoFaturaPassada = dataFaturaAnterior.getFullYear();

    await criarTransacao({
      descricao: "Bolsa Auxílio / Estágio",
      valor: 900.0,
      tipo: TipoTransacao.RECEITA,
      formaPagamento: FormaPagamento.PIX,
      contaId: contaNubank.id,
      categoriaId: catSalario,
      data: getDataRelativa(-1, 5, 10, 0),
    });

    await criarTransacao({
      descricao: "Aluguel",
      valor: 600.0,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.PIX,
      contaId: contaNubank.id,
      categoriaId: catMoradia,
      data: getDataRelativa(-1, 6, 10, 30),
    });

    await criarTransacao({
      descricao: "Bolsa Auxílio / Estágio",
      valor: 900.0,
      tipo: TipoTransacao.RECEITA,
      formaPagamento: FormaPagamento.PIX,
      contaId: contaNubank.id,
      categoriaId: catSalario,
      data: getDataRelativa(0, 5, 10, 0),
    });

    await criarTransacao({
      descricao: "Aluguel",
      valor: 600.0,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.PIX,
      contaId: contaNubank.id,
      categoriaId: catMoradia,
      data: getDataRelativa(0, 6, 10, 30),
    });

    await criarTransacao({
      descricao: "Supermercado",
      valor: 112.3,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.DEBITO,
      contaId: contaNubank.id,
      categoriaId: catAlimentacao,
      data: getDataDiasAtras(45, 18, 45),
    });

    await criarCredito(
      {
        descricao: "SSD 1TB",
        valor: 550.0,
        categoriaId: catLazer,
        numeroParcelas: 4,
        data: getDataDiasAtras(40, 16, 40),
      },
      cartaoItau,
    );

    await criarTransacao({
      descricao: "Conta de Energia",
      valor: 85.4,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.PIX,
      contaId: contaNubank.id,
      categoriaId: catMoradia,
      data: getDataDiasAtras(30, 9, 15),
    });

    await criarTransferencia(
      {
        descricao: "Reserva de Emergência",
        valor: 150.0,
        formaPagamento: FormaPagamento.PIX,
        categoriaId: catOutros,
        data: getDataDiasAtras(25, 20, 0),
      },
      contaNubank.id,
      contaCaixa.id,
    );

    await criarCredito(
      {
        descricao: "Pássaro Marron (Passagem)",
        valor: 92.0,
        categoriaId: catTransporte,
        numeroParcelas: 1,
        data: getDataDiasAtras(20, 14, 20),
      },
      cartaoNubank,
    );

    await criarTransacao({
      descricao: "Manutenção de PC (Bico)",
      valor: 100.0,
      tipo: TipoTransacao.RECEITA,
      formaPagamento: FormaPagamento.DINHEIRO,
      contaId: contaCarteira.id,
      categoriaId: catSalario,
      data: getDataDiasAtras(15, 14, 0),
    });

    await criarCredito(
      {
        descricao: "Pizzaria",
        valor: 45.0,
        categoriaId: catAlimentacao,
        numeroParcelas: 1,
        data: getDataDiasAtras(10, 21, 30),
      },
      cartaoNubank,
    );

    await criarTransacao({
      descricao: "Barbearia",
      valor: 35.0,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.DEBITO,
      contaId: contaNubank.id,
      categoriaId: catSaude,
      data: getDataDiasAtras(7, 16, 0),
    });

    await criarCredito(
      {
        descricao: "Spotify Premium",
        valor: 21.9,
        categoriaId: catLazer,
        numeroParcelas: 1,
        data: getDataDiasAtras(5, 9, 0),
      },
      cartaoNubank,
    );

    await criarTransacao({
      descricao: "Padaria",
      valor: 14.0,
      tipo: TipoTransacao.DESPESA,
      formaPagamento: FormaPagamento.DINHEIRO,
      contaId: contaCarteira.id,
      categoriaId: catAlimentacao,
      data: getDataDiasAtras(3, 8, 15),
    });

    await criarCredito(
      {
        descricao: "Supermercado",
        valor: 140.5,
        categoriaId: catAlimentacao,
        numeroParcelas: 1,
        data: getDataDiasAtras(1, 19, 20),
      },
      cartaoItau,
    );

    await pagarFatura(
      cartaoNubank.id,
      mesFaturaPassada,
      anoFaturaPassada,
      contaNubank.id,
      getDataRelativa(0, 5, 9, 0),
    );

    console.log(
      `Seed concluído para o usuário ID: ${usuarioId} [DADOS PARA TESTES - DISTRIBUIÇÃO DINÂMICA 45 DIAS]`,
    );
  } catch (error) {
    console.error("Erro ao popular dados do usuário:", error);
  }
}
