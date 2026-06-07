import { type Request, type Response } from "express";
import { RelatorioRepository } from "../repositories/RelatorioRepository.js";

const relatorioRepository = new RelatorioRepository();

export class RelatorioController {
  async obterDados(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const { periodo, contas, cartoes } = req.query;

      let dataInicio = new Date();
      const dataFim = new Date();

      if (periodo === "7") {
        dataInicio.setDate(dataInicio.getDate() - 7);
      } else if (periodo === "90") {
        dataInicio.setDate(dataInicio.getDate() - 90);
      } else if (periodo === "ano") {
        dataInicio = new Date(dataFim.getFullYear(), 0, 1);
      } else {
        dataInicio.setDate(dataInicio.getDate() - 30);
      }

      let fonteFiltro: { contas?: number[]; cartoes?: number[] } | undefined;

      if (contas || cartoes) {
        fonteFiltro = {};
        if (contas) {
          fonteFiltro.contas = String(contas).split(",").map(Number);
        }
        if (cartoes) {
          fonteFiltro.cartoes = String(cartoes).split(",").map(Number);
        }
      }

      const resumo = await relatorioRepository.obterResumo(
        usuarioId,
        dataInicio,
        dataFim,
        fonteFiltro,
      );

      const tempoDias = Math.floor(
        (dataFim.getTime() - dataInicio.getTime()) / (1000 * 3600 * 24),
      );
      const dataInicioAnt = new Date(dataInicio);
      dataInicioAnt.setDate(dataInicioAnt.getDate() - tempoDias);
      const dataFimAnt = new Date(dataInicio);

      const resumoAnt = await relatorioRepository.obterResumo(
        usuarioId,
        dataInicioAnt,
        dataFimAnt,
        fonteFiltro,
      );

      const calcVariacao = (atual: number, anterior: number) => {
        if (anterior === 0) return atual > 0 ? 100 : 0;
        return Number(
          (((atual - anterior) / Math.abs(anterior)) * 100).toFixed(1),
        );
      };

      const resumoComVariacao = {
        receitas: {
          valor: resumo.receitas,
          variacao: calcVariacao(resumo.receitas, resumoAnt.receitas),
        },
        despesas: {
          valor: resumo.despesas,
          variacao: calcVariacao(resumo.despesas, resumoAnt.despesas),
        },
        saldo: {
          valor: resumo.saldo,
          variacao: calcVariacao(resumo.saldo, resumoAnt.saldo),
        },
      };

      const categoriasRaw = await relatorioRepository.obterDespesasPorCategoria(
        usuarioId,
        dataInicio,
        dataFim,
        fonteFiltro,
      );

      const categorias = categoriasRaw.map((c) => ({
        ...c,
        percent:
          resumo.despesas > 0
            ? Number(((c.value / resumo.despesas) * 100).toFixed(1))
            : 0,
      }));

      const evolucao = await relatorioRepository.obterEvolucaoDinamicamente(
        usuarioId,
        dataInicio,
        dataFim,
        fonteFiltro,
      );

      return res.status(200).json({
        resumo: resumoComVariacao,
        categorias,
        evolucao,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao gerar relatórios." });
    }
  }
}
