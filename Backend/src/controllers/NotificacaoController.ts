import { type Request, type Response } from "express";
import { NotificacaoRepository } from "../repositories/NotificacaoRepository.js";

const repo = new NotificacaoRepository();

export class NotificacaoController {
  async listar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const notas = await repo.buscarParaUsuario(usuarioId);
      return res.status(200).json(notas);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao listar notificações." });
    }
  }
}
