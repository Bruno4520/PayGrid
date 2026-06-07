import { type Request, type Response } from "express";
import { CartaoCreditoRepository } from "../repositories/CartaoCreditoRepository.js";

const cartaoCreditoRepository = new CartaoCreditoRepository();

export class CartaoCreditoController {
  async criar(req: Request, res: Response) {
    try {
      const {
        nome,
        limite,
        diaFechamentoFatura,
        diaVencimentoFatura,
        ultimosDigitos,
      } = req.body;
      const usuarioId = req.user!.id;

      if (!nome || !limite || !diaFechamentoFatura || !diaVencimentoFatura) {
        return res
          .status(400)
          .json({ mensagem: "Todos os campos são obrigatórios." });
      }

      const novoCartao = await cartaoCreditoRepository.criar({
        nome,
        limite,
        diaFechamentoFatura,
        diaVencimentoFatura,
        usuarioId,
        ultimosDigitos,
      });

      return res.status(201).json(novoCartao);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao criar cartão." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const cartoes =
        await cartaoCreditoRepository.buscarTodosPorUsuarioId(usuarioId);
      return res.status(200).json(cartoes);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao listar cartões." });
    }
  }

  async listarFaturas(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuarioId = req.user!.id;

      const cartao = await cartaoCreditoRepository.buscarPorIdEUsuarioId(
        Number(id),
        usuarioId,
      );
      if (!cartao) {
        return res
          .status(404)
          .json({ mensagem: "Cartão de crédito não encontrado." });
      }

      const cartaoComFaturas =
        await cartaoCreditoRepository.buscarFaturasPorCartaoId(Number(id));
      return res.status(200).json(cartaoComFaturas?.faturas || []);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao listar faturas." });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuarioId = req.user!.id;
      const {
        nome,
        limite,
        diaFechamentoFatura,
        diaVencimentoFatura,
        ultimosDigitos,
      } = req.body;

      const cartaoExistente =
        await cartaoCreditoRepository.buscarPorIdEUsuarioId(
          Number(id),
          usuarioId,
        );
      if (!cartaoExistente) {
        return res
          .status(404)
          .json({ mensagem: "Cartão de crédito não encontrado." });
      }

      const cartaoAtualizado = await cartaoCreditoRepository.atualizar(
        Number(id),
        {
          nome,
          limite,
          diaFechamentoFatura,
          diaVencimentoFatura,
          ultimosDigitos,
        },
      );

      return res.status(200).json(cartaoAtualizado);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao atualizar cartão." });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuarioId = req.user!.id;

      const cartaoExistente =
        await cartaoCreditoRepository.buscarPorIdEUsuarioId(
          Number(id),
          usuarioId,
        );
      if (!cartaoExistente) {
        return res
          .status(404)
          .json({ mensagem: "Cartão de crédito não encontrado." });
      }

      await cartaoCreditoRepository.deletar(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao deletar cartão." });
    }
  }
}
