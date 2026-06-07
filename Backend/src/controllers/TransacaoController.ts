import { type Request, type Response } from "express";
import { TransacaoRepository } from "../repositories/TransacaoRepository.js";
import { ContaRepository } from "../repositories/ContaRepository.js";
import { CategoriaRepository } from "../repositories/CategoriaRepository.js";
import { CartaoCreditoRepository } from "../repositories/CartaoCreditoRepository.js";

const transacaoRepository = new TransacaoRepository();
const contaRepository = new ContaRepository();
const categoriaRepository = new CategoriaRepository();
const cartaoCreditoRepository = new CartaoCreditoRepository();

export class TransacaoController {
  async listarTodas(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const transacoes =
        await transacaoRepository.buscarTodasPorUsuarioId(usuarioId);
      return res.status(200).json(transacoes);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao listar transações." });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const { formaPagamento } = req.body;

      if (formaPagamento === "CREDITO") {
        const {
          descricao,
          valor,
          categoriaId,
          cartaoCreditoId,
          observacoes,
          data,
        } = req.body;
        const numeroParcelas = req.body.numeroParcelas || 1;

        if (!descricao || !valor || !cartaoCreditoId || !data) {
          return res.status(400).json({
            mensagem:
              "Todos os campos obrigatórios (incluindo data) devem ser preenchidos.",
          });
        }

        const cartao = await cartaoCreditoRepository.buscarPorIdEUsuarioId(
          cartaoCreditoId,
          usuarioId,
        );
        if (!cartao) {
          return res
            .status(403)
            .json({ mensagem: "Cartão de crédito não encontrado." });
        }

        if (categoriaId) {
          const categoria = await categoriaRepository.buscarPorIdEUsuarioId(
            categoriaId,
            usuarioId,
          );
          if (!categoria) {
            return res
              .status(403)
              .json({ mensagem: "Categoria não encontrada." });
          }
        }

        const novaTransacao = await transacaoRepository.criarCompraCredito(
          {
            descricao,
            valor,
            categoriaId,
            cartaoCreditoId,
            numeroParcelas,
            observacoes,
            data,
          },
          cartao,
        );

        return res.status(201).json(novaTransacao);
      } else {
        const {
          descricao,
          valor,
          tipo,
          contaId,
          categoriaId,
          observacoes,
          data,
        } = req.body;

        if (!descricao || !valor || !tipo || !contaId || !data) {
          return res.status(400).json({
            mensagem:
              "Todos os campos obrigatórios (incluindo data) devem ser preenchidos.",
          });
        }

        const conta = await contaRepository.buscarPorIdEUsuarioId(
          contaId,
          usuarioId,
        );
        if (!conta) {
          return res.status(403).json({ mensagem: "Conta não encontrada." });
        }

        if (categoriaId) {
          const categoria = await categoriaRepository.buscarPorIdEUsuarioId(
            categoriaId,
            usuarioId,
          );
          if (!categoria) {
            return res
              .status(403)
              .json({ mensagem: "Categoria não encontrada." });
          }
        }

        const novaTransacao = await transacaoRepository.criar({
          descricao,
          valor,
          tipo,
          formaPagamento,
          contaId,
          categoriaId,
          observacoes,
          data,
        });

        return res.status(201).json(novaTransacao);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao criar transação." });
    }
  }

  async listarPorConta(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const { contaId } = req.params;

      const conta = await contaRepository.buscarPorIdEUsuarioId(
        Number(contaId),
        usuarioId,
      );
      if (!conta) {
        return res.status(403).json({ mensagem: "Conta não encontrada." });
      }

      const transacoes = await transacaoRepository.buscarTodasPorContaId(
        Number(contaId),
      );
      return res.status(200).json(transacoes);
    } catch (error) {
      return res
        .status(500)
        .json({
          mensagem: "Erro interno do servidor ao listar transações por conta.",
        });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const { id } = req.params;

      const transacao = await transacaoRepository.buscarPorId(Number(id));
      if (!transacao) {
        return res.status(404).json({ mensagem: "Transação não encontrada." });
      }

      if (transacao.formaPagamento === "CREDITO") {
        if (!transacao.cartaoCreditoId) {
          return res
            .status(500)
            .json({
              mensagem:
                "Erro de integridade: Transação de crédito sem cartão vinculado.",
            });
        }

        const cartao = await cartaoCreditoRepository.buscarPorIdEUsuarioId(
          transacao.cartaoCreditoId,
          usuarioId,
        );
        if (!cartao) {
          return res
            .status(403)
            .json({ mensagem: "Cartão de crédito não encontrado." });
        }

        await transacaoRepository.deletarCredito(transacao.id);
      } else {
        if (transacao.contaId) {
          const conta = await contaRepository.buscarPorIdEUsuarioId(
            transacao.contaId,
            usuarioId,
          );
          if (!conta) {
            return res.status(403).json({ mensagem: "Conta não encontrada." });
          }
        }

        await transacaoRepository.deletar(transacao);
      }

      return res.status(204).send();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao deletar transação." });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const { id } = req.params;
      const novosDados = req.body;

      const transacaoAntiga = await transacaoRepository.buscarPorId(Number(id));
      if (!transacaoAntiga) {
        return res.status(404).json({ mensagem: "Transação não encontrada." });
      }

      if (
        (transacaoAntiga.formaPagamento === "CREDITO" &&
          novosDados.formaPagamento !== "CREDITO") ||
        (transacaoAntiga.formaPagamento !== "CREDITO" &&
          novosDados.formaPagamento === "CREDITO")
      ) {
        return res.status(400).json({
          mensagem:
            "Não é possível alterar entre Cartão de Crédito e outras formas de pagamento na edição. Exclua esta transação e crie uma nova.",
        });
      }

      if (transacaoAntiga.formaPagamento === "CREDITO") {
        const cartao = await cartaoCreditoRepository.buscarPorIdEUsuarioId(
          novosDados.cartaoCreditoId,
          usuarioId,
        );
        if (!cartao) {
          return res
            .status(403)
            .json({ mensagem: "Cartão de crédito não encontrado." });
        }

        if (novosDados.categoriaId) {
          const categoria = await categoriaRepository.buscarPorIdEUsuarioId(
            novosDados.categoriaId,
            usuarioId,
          );
          if (!categoria) {
            return res
              .status(403)
              .json({ mensagem: "Categoria não encontrada." });
          }
        }

        const transacaoAtualizada = await transacaoRepository.atualizarCredito(
          transacaoAntiga,
          novosDados,
          cartao,
        );
        return res.status(200).json(transacaoAtualizada);
      } else {
        const conta = await contaRepository.buscarPorIdEUsuarioId(
          novosDados.contaId,
          usuarioId,
        );
        if (!conta) {
          return res.status(403).json({ mensagem: "Conta não encontrada." });
        }

        if (novosDados.categoriaId) {
          const categoria = await categoriaRepository.buscarPorIdEUsuarioId(
            novosDados.categoriaId,
            usuarioId,
          );
          if (!categoria) {
            return res
              .status(403)
              .json({ mensagem: "Categoria não encontrada." });
          }
        }

        const transacaoAtualizada = await transacaoRepository.atualizar(
          transacaoAntiga,
          novosDados,
        );
        return res.status(200).json(transacaoAtualizada);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Erro interno do servidor ao atualizar transação." });
    }
  }
}
