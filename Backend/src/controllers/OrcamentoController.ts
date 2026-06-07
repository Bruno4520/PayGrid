import { type Request, type Response } from "express";
import { OrcamentoRepository } from "../repositories/OrcamentoRepository.js";
import { CategoriaRepository } from "../repositories/CategoriaRepository.js";

const orcamentoRepository = new OrcamentoRepository();
const categoriaRepository = new CategoriaRepository();

export class OrcamentoController {
  async definir(req: Request, res: Response) {
    try {
      const { valorPlanejado, mes, ano, categoriaId } = req.body;
      const usuarioId = req.user!.id;

      if (valorPlanejado === undefined || !mes || !ano || !categoriaId) {
        return res
          .status(400)
          .json({ mensagem: "Todos os campos do orçamento são obrigatórios." });
      }

      const categoria = await categoriaRepository.buscarPorIdEUsuarioId(
        categoriaId,
        usuarioId,
      );

      if (!categoria) {
        return res.status(403).json({
          mensagem: "Categoria inválida ou não pertence ao utilizador.",
        });
      }

      const orcamento = await orcamentoRepository.definir({
        valorPlanejado,
        mes,
        ano,
        categoriaId,
        usuarioId,
      });

      return res.status(201).json(orcamento);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao definir o orçamento." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const { mes, ano } = req.query;

      if (!mes || !ano) {
        return res
          .status(400)
          .json({ mensagem: "Mês e ano são obrigatórios na busca." });
      }

      const dados = await orcamentoRepository.buscarOrcamentosDoMes(
        usuarioId,
        Number(mes),
        Number(ano),
      );

      return res.status(200).json(dados);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao listar orçamentos." });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const { categoriaId, mes, ano } = req.params;

      await orcamentoRepository.deletar(
        usuarioId,
        Number(categoriaId),
        Number(mes),
        Number(ano),
      );

      return res.status(204).send();
    } catch (error) {
      return res.status(204).send();
    }
  }
}
