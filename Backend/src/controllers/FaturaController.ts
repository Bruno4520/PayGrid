import { type Request, type Response } from "express";
import { FaturaRepository } from "../repositories/FaturaRepository.js";
import { ContaRepository } from "../repositories/ContaRepository.js";
import { CategoriaRepository } from "../repositories/CategoriaRepository.js";

const faturaRepository = new FaturaRepository();
const contaRepository = new ContaRepository();
const categoriaRepository = new CategoriaRepository();

export class FaturaController {
  async pagar(req: Request, res: Response) {
    try {
      const { id: faturaId } = req.params;
      const { contaId } = req.body;
      const usuarioId = req.user!.id;

      if (!contaId) {
        return res.status(400).json({ mensagem: "ID da conta inválido." });
      }

      const fatura = await faturaRepository.buscarPorIdEUsuarioId(
        Number(faturaId),
        usuarioId,
      );

      if (!fatura) {
        return res.status(404).json({ mensagem: "Fatura não encontrada." });
      }

      if (fatura.estaPaga) {
        return res.status(409).json({ mensagem: "Esta fatura já foi paga." });
      }

      const contaOrigem = await contaRepository.buscarPorIdEUsuarioId(
        Number(contaId),
        usuarioId,
      );

      if (!contaOrigem) {
        return res
          .status(404)
          .json({ mensagem: "Conta de origem não encontrada." });
      }

      if (contaOrigem.saldo < fatura.valorTotal) {
        return res
          .status(400)
          .json({ mensagem: "Saldo insuficiente na conta selecionada." });
      }

      const categoriaFatura =
        await categoriaRepository.buscarCategoriaFatura(usuarioId);

      if (!categoriaFatura) {
        return res.status(500).json({
          mensagem:
            "Erro interno: Categoria de pagamento de fatura não foi encontrada no sistema.",
        });
      }

      await faturaRepository.pagar({
        fatura,
        contaId: Number(contaId),
        categoriaId: categoriaFatura.id,
      });

      return res.status(200).json({ mensagem: "Fatura paga com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno ao processar o pagamento da fatura." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const faturas = await faturaRepository.buscarTodasPorUsuario(usuarioId);
      return res.status(200).json(faturas);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno ao listar faturas." });
    }
  }
}
