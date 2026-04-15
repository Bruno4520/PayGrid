import { type Request, type Response } from 'express';
import { type JwtPayload } from 'jsonwebtoken';
import { CategoriaRepository } from '../repositories/CategoriaRepository.js';

const categoriaRepository = new CategoriaRepository();

export class CategoriaController {

    async criar(req: Request, res: Response) {
        try {
            const { nome, descricao, observacoes } = req.body;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            if (!nome) {
                return res.status(400).json({ mensagem: 'O nome da categoria é obrigatório.' });
            }

            const novaCategoria = await categoriaRepository.criar({ nome, descricao, observacoes, usuarioId });
            return res.status(201).json(novaCategoria);
        } catch (error: any) {
            if (error.code === 'P2002') {
                return res.status(409).json({ mensagem: 'Você já possui uma categoria com este nome.' });
            }
            console.error("ERRO AO CRIAR CATEGORIA:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const { id: usuarioId } = (req as any).user as JwtPayload;
            const categorias = await categoriaRepository.buscarTodasPorUsuarioId(usuarioId);
            return res.status(200).json(categorias);
        } catch (error) {
            console.error("ERRO AO LISTAR CATEGORIAS:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, descricao, observacoes } = req.body;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            const categoriaExistente = await categoriaRepository.buscarPorIdEUsuarioId(Number(id), usuarioId);
            if (!categoriaExistente) {
                return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
            }

            if (categoriaExistente.sistema) {
                return res.status(403).json({ mensagem: 'Não é permitido editar essa categoria' });
            }

            const categoriaAtualizada = await categoriaRepository.atualizar(Number(id), { nome, descricao, observacoes });
            return res.status(200).json(categoriaAtualizada);
        } catch (error: any) {
            console.error("ERRO AO ATUALIZAR CATEGORIA:", error);
            if (error.code === 'P2002') {
                return res.status(409).json({ mensagem: 'Você já possui uma categoria com este nome.' });
            }
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            const categoriaExistente = await categoriaRepository.buscarPorIdEUsuarioId(Number(id), usuarioId);
            if (!categoriaExistente) {
                return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
            }

            if (categoriaExistente.sistema) {
                return res.status(403).json({ mensagem: 'Não é permitido excluir essa categoria' });
            }

            const orcamentoAssociado = await categoriaRepository.temOrcamentos(Number(id));

            if (orcamentoAssociado) {
                return res.status(409).json({
                    mensagem: `Não é possível excluir a categoria "${categoriaExistente.nome}". Exclua ou altere os orçamentos associados primeiro.`
                });
            }

            await categoriaRepository.deletar(Number(id));
            return res.status(204).send();
        } catch (error) {
            console.error("ERRO AO DELETAR CATEGORIA:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }
}