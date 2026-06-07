import { type Request, type Response } from "express";
import { ContaRepository } from "../repositories/ContaRepository.js";

const repository = new ContaRepository();

export class ContaController {
  async criar(req: Request, res: Response) {
    const { nome, saldo, tipo, numeroConta, agencia } = req.body;
    const usuarioId = req.user!.id;

    if (!nome || saldo === undefined || !tipo) {
      return res
        .status(400)
        .json({ mensagem: "Campos obrigatórios ausentes." });
    }

    try {
      const conta = await repository.criar({
        nome,
        saldo,
        tipo,
        usuarioId,
        numeroConta,
        agencia,
      });
      return res.status(201).json(conta);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno ao criar conta." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const contas = await repository.buscarTodasPorUsuarioId(req.user!.id);
      return res.status(200).json(contas);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno ao listar contas." });
    }
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, saldo, tipo, numeroConta, agencia } = req.body;
    const usuarioId = req.user!.id;

    try {
      const contaExistente = await repository.buscarPorIdEUsuarioId(
        Number(id),
        usuarioId,
      );
      if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
      }

      const conta = await repository.atualizar(Number(id), {
        nome,
        saldo,
        tipo,
        numeroConta,
        agencia,
      });
      return res.status(200).json(conta);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno ao atualizar conta." });
    }
  }

  async deletar(req: Request, res: Response) {
    const { id } = req.params;
    const usuarioId = req.user!.id;

    try {
      const contaExistente = await repository.buscarPorIdEUsuarioId(
        Number(id),
        usuarioId,
      );
      if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
      }

      await repository.deletar(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno ao excluir conta." });
    }
  }
}
