import { type Request, type Response } from 'express';
import { type JwtPayload } from 'jsonwebtoken';
import { TransacaoRepository } from '../repositories/TransacaoRepository.js';
import { ContaRepository } from '../repositories/ContaRepository.js';
import { CategoriaRepository } from '../repositories/CategoriaRepository.js';
import { CartaoCreditoRepository } from '../repositories/CartaoCreditoRepository.js';

const transacaoRepository = new TransacaoRepository();
const contaRepository = new ContaRepository();
const categoriaRepository = new CategoriaRepository();
const cartaoCreditoRepository = new CartaoCreditoRepository();

export class TransacaoController {

    async criar(req: Request, res: Response) {
        try {
            const { formaPagamento } = req.body;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            if (formaPagamento === 'CREDITO') {
                const { descricao, valor, categoriaId, cartaoCreditoId, numeroParcelas } = req.body;
                if (!descricao || !valor || !categoriaId || !cartaoCreditoId || !numeroParcelas) {
                    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
                }

                const cartao = await cartaoCreditoRepository.buscarPorIdEUsuarioId(cartaoCreditoId, usuarioId);
                if (!cartao) return res.status(403).json({ mensagem: 'Cartão de crédito inválido.' });
                const categoria = await categoriaRepository.buscarPorIdEUsuarioId(categoriaId, usuarioId);
                if (!categoria) return res.status(403).json({ mensagem: 'Categoria inválida.' });

                const novaTransacao = await transacaoRepository.criarCompraCredito({
                    descricao, valor, categoriaId, cartaoCreditoId, numeroParcelas
                }, cartao);

                return res.status(201).json(novaTransacao);

            } else {
                const { descricao, valor, tipo, contaId, categoriaId } = req.body;
                if (!descricao || !valor || !tipo || !contaId || !categoriaId) {
                    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
                }

                const conta = await contaRepository.buscarPorIdEUsuarioId(contaId, usuarioId);
                if (!conta) return res.status(403).json({ mensagem: 'A conta inválida.' });
                const categoria = await categoriaRepository.buscarPorIdEUsuarioId(categoriaId, usuarioId);
                if (!categoria) return res.status(403).json({ mensagem: 'A categoria inválida.' });

                const novaTransacao = await transacaoRepository.criar({
                    descricao, valor, tipo, formaPagamento, contaId, categoriaId
                });

                return res.status(201).json(novaTransacao);
            }
        } catch (error) {
            console.error("ERRO AO CRIAR TRANSAÇÃO:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }

    async listarPorConta(req: Request, res: Response) {
        try {
            const { contaId } = req.params;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            const conta = await contaRepository.buscarPorIdEUsuarioId(Number(contaId), usuarioId);
            if (!conta) {
                return res.status(403).json({ mensagem: 'Acesso negado.' });
            }

            const transacoes = await transacaoRepository.buscarTodasPorContaId(Number(contaId));
            return res.status(200).json(transacoes);
        } catch (error) {
            console.error("ERRO AO LISTAR TRANSAÇÕES:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }
}