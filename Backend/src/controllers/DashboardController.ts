import { type Request, type Response } from "express";
import { DashboardRepository } from "../repositories/DashboardRepository.js";

const dashboardRepository = new DashboardRepository();

export class DashboardController {
  async resumo(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const dados = await dashboardRepository.obterResumo(usuarioId);
      return res.status(200).json(dados);
    } catch (error) {
      return res.status(500).json({
        mensagem: "Erro interno do servidor ao carregar o dashboard.",
      });
    }
  }
}
