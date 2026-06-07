import { type Request, type Response } from "express";
import { SimulacaoRepository } from "../repositories/SimulacaoRepository.js";

const simulacaoRepository = new SimulacaoRepository();

function calcularValorFinalBruto(
  valorInicial: number,
  aporteMensal: number,
  taxaMensal: number,
  periodoMeses: number,
): number {
  if (taxaMensal === 0) return valorInicial + aporteMensal * periodoMeses;

  const fator = Math.pow(1 + taxaMensal, periodoMeses);
  const montante =
    valorInicial * fator + aporteMensal * ((fator - 1) / taxaMensal);

  return parseFloat(montante.toFixed(2));
}

function calcularIR(rendimentoBruto: number, periodoMeses: number): number {
  const dias = periodoMeses * 30;
  let aliquota = 0;

  if (dias <= 180) aliquota = 0.225;
  else if (dias <= 360) aliquota = 0.2;
  else if (dias <= 720) aliquota = 0.175;
  else aliquota = 0.15;

  return parseFloat((rendimentoBruto * aliquota).toFixed(2));
}

export class SimulacaoController {
  async simular(req: Request, res: Response) {
    try {
      const {
        nome,
        valorInicial,
        aporteMensal,
        taxa,
        unidadeTaxa,
        periodo,
        unidadePeriodo,
      } = req.body;
      const usuarioId = req.user!.id;

      if (
        !nome ||
        valorInicial === undefined ||
        aporteMensal === undefined ||
        !taxa ||
        !unidadeTaxa ||
        !periodo ||
        !unidadePeriodo
      ) {
        return res
          .status(400)
          .json({ mensagem: "Todos os campos são obrigatórios." });
      }
      if (unidadeTaxa !== "am" && unidadeTaxa !== "aa") {
        return res.status(400).json({ mensagem: "Unidade da taxa inválida." });
      }
      if (unidadePeriodo !== "meses" && unidadePeriodo !== "anos") {
        return res
          .status(400)
          .json({ mensagem: "Unidade de período inválida." });
      }
      if (
        typeof nome !== "string" ||
        typeof valorInicial !== "number" ||
        typeof aporteMensal !== "number" ||
        typeof taxa !== "number" ||
        typeof periodo !== "number"
      ) {
        return res.status(400).json({ mensagem: "Tipos dos dados inválidos." });
      }
      if (valorInicial < 0 || aporteMensal < 0 || taxa <= 0 || periodo <= 0) {
        return res.status(400).json({ mensagem: "Valores inválidos." });
      }

      const periodoMeses = unidadePeriodo === "anos" ? periodo * 12 : periodo;

      let taxaMensal: number;
      if (unidadeTaxa === "aa") {
        taxaMensal = Math.pow(1 + taxa / 100, 1 / 12) - 1;
      } else {
        taxaMensal = taxa / 100;
      }

      const valorFinalBruto = calcularValorFinalBruto(
        valorInicial,
        aporteMensal,
        taxaMensal,
        periodoMeses,
      );
      const totalInvestido = parseFloat(
        (valorInicial + aporteMensal * periodoMeses).toFixed(2),
      );
      const rendimentoBruto = valorFinalBruto - totalInvestido;

      const valorImposto =
        rendimentoBruto > 0 ? calcularIR(rendimentoBruto, periodoMeses) : 0;
      const valorFinalLiquido = parseFloat(
        (valorFinalBruto - valorImposto).toFixed(2),
      );

      const novaSimulacao = await simulacaoRepository.salvar({
        nome,
        valorInicial,
        aporteMensal,
        taxaMensal: parseFloat((taxaMensal * 100).toFixed(4)),
        periodoMensal: periodoMeses,
        valorFinalBruto,
        valorImposto,
        valorFinalLiquido,
        totalInvestido,
        ganhoLiquido: parseFloat(
          (valorFinalLiquido - totalInvestido).toFixed(2),
        ),
        usuarioId,
      });

      return res.status(201).json(novaSimulacao);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao realizar simulação." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const simulacoes =
        await simulacaoRepository.buscarTodasPorUsuarioId(usuarioId);
      return res.status(200).json(simulacoes);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao listar simulações." });
    }
  }
}
