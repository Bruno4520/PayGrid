import { type Request, type Response } from 'express';
import { type JwtPayload } from 'jsonwebtoken';
import { OrcamentoRepository } from '../repositories/OrcamentoRepository.js';
import { CategoriaRepository } from '../repositories/CategoriaRepository.js';

const orcamentoRepository = new OrcamentoRepository();
const categoriaRepository = new CategoriaRepository();

export class OrcamentoController {

    async definir(req: Request, res: Response) {
        try {
            const { valorPlanejado, mes, ano, categoriaId } = req.body;
            const { id: usuarioId } = (req as any).user as JwtPayload;

            if (!valorPlanejado || !mes || !ano || !categoriaId) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
            }
            const categoria = await categoriaRepository.buscarPorIdEUsuarioId(categoriaId, usuarioId);
            if (!categoria) {
                return res.status(403).json({ mensagem: 'Categoria inválida.' });
            }

            const orcamento = await orcamentoRepository.definir({ valorPlanejado, mes, ano, categoriaId, usuarioId });
            return res.status(201).json(orcamento);
        } catch (error) {
            console.error("ERRO AO DEFINIR ORÇAMENTO:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const { id: usuarioId } = (req as any).user as JwtPayload;
            const orcamentos = await orcamentoRepository.buscarTodosPorUsuarioId(usuarioId);

            const orcamentosComGasto = await Promise.all(
                orcamentos.map(async (orcamento) => {
                    const gastoAtual = await orcamentoRepository.calcularGastoAtual(orcamento);
                    return { ...orcamento, gastoAtual };
                })
            );

            return res.status(200).json(orcamentosComGasto);
        } catch (error) {
            console.error("ERRO AO LISTAR ORÇAMENTOS:", error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }
}