import { type Request, type Response } from "express";
import { CategoriaRepository } from "../repositories/CategoriaRepository.js";

const categoriaRepository = new CategoriaRepository();

export class CategoriaController {
  async criar(req: Request, res: Response) {
    try {
      const { nome, descricao, cor, icone, observacoes } = req.body;
      const usuarioId = req.user!.id;

      if (!nome) {
        return res
          .status(400)
          .json({ mensagem: "O nome da categoria é obrigatório." });
      }

      const novaCategoria = await categoriaRepository.criar({
        nome,
        descricao,
        cor,
        icone,
        observacoes,
        usuarioId,
      });

      return res.status(201).json(novaCategoria);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        if ((error as { code: string }).code === "P2002") {
          return res
            .status(409)
            .json({ mensagem: "Você já possui uma categoria com este nome." });
        }
      }
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao criar categoria." });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const categorias =
        await categoriaRepository.buscarTodasPorUsuarioId(usuarioId);
      return res.status(200).json(categorias);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao listar categorias." });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao, cor, icone, observacoes } = req.body;
      const usuarioId = req.user!.id;

      const categoriaExistente =
        await categoriaRepository.buscarPorIdEUsuarioId(Number(id), usuarioId);

      if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada." });
      }

      if (categoriaExistente.sistema) {
        return res
          .status(403)
          .json({
            mensagem: "Não é permitido editar as categorias do sistema.",
          });
      }

      const categoriaAtualizada = await categoriaRepository.atualizar(
        Number(id),
        {
          nome,
          descricao,
          cor,
          icone,
          observacoes,
        },
      );

      return res.status(200).json(categoriaAtualizada);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        if ((error as { code: string }).code === "P2002") {
          return res
            .status(409)
            .json({ mensagem: "Você já possui uma categoria com este nome." });
        }
      }
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao atualizar categoria." });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuarioId = req.user!.id;

      const categoriaExistente =
        await categoriaRepository.buscarPorIdEUsuarioId(Number(id), usuarioId);

      if (!categoriaExistente) {
        return res.status(404).json({ mensagem: "Categoria não encontrada." });
      }

      if (categoriaExistente.sistema) {
        return res
          .status(403)
          .json({
            mensagem: "Não é permitido excluir as categorias base do sistema.",
          });
      }

      await categoriaRepository.deletar(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao deletar categoria." });
    }
  }
}
