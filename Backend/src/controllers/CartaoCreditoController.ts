import { type Request, type Response } from 'express';
import { type JwtPayload } from 'jsonwebtoken';
import { CartaoCreditoRepository } from '../repositories/CartaoCreditoRepository.js';

const cartaoCreditoRepository = new CartaoCreditoRepository();

export class CartaoCreditoController {

    async criar(req: Request, res: Response) {
        try {
            const { nome, limite, diaFechamentoFatura, diaVencimentoFatura, ultimosDigitos } = req.body;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            if (!nome || !limite || !diaFechamentoFatura || !diaVencimentoFatura) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
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
            console.error("ERRO AO CRIAR CARTÃO DE CRÉDITO:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const { id: usuarioId } = (req as any).user as JwtPayload;
            const cartoes = await cartaoCreditoRepository.buscarTodosPorUsuarioId(usuarioId);
            return res.status(200).json(cartoes);
        } catch (error) {
            console.error("ERRO AO LISTAR CARTÕES DE CRÉDITO:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }

    async listarFaturas(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            const cartao = await cartaoCreditoRepository.buscarPorIdEUsuarioId(Number(id), usuarioId);
            if (!cartao) {
                return res.status(404).json({ mensagem: 'Cartão de crédito não encontrado.' });
            }

            const cartaoComFaturas = await cartaoCreditoRepository.buscarFaturasPorCartaoId(Number(id));
            return res.status(200).json(cartaoComFaturas?.faturas || []);
        } catch (error) {
            console.error("ERRO AO LISTAR FATURAS:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const dadosParaAtualizar = req.body;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            const cartaoExistente = await cartaoCreditoRepository.buscarPorIdEUsuarioId(Number(id), usuarioId);
            if (!cartaoExistente) {
                return res.status(404).json({ mensagem: 'Cartão de crédito não encontrado.' });
            }

            const cartaoAtualizado = await cartaoCreditoRepository.atualizar(Number(id), dadosParaAtualizar);
            return res.status(200).json(cartaoAtualizado);
        } catch (error) {
            console.error("ERRO AO ATUALIZAR CARTÃO:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            const cartaoExistente = await cartaoCreditoRepository.buscarPorIdEUsuarioId(Number(id), usuarioId);
            if (!cartaoExistente) {
                return res.status(404).json({ mensagem: 'Cartão de crédito não encontrado.' });
            }

            await cartaoCreditoRepository.deletar(Number(id));
            return res.status(204).send();
        } catch (error) {
            console.error("ERRO AO DELETAR CARTÃO:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }
}