import { type Request, type Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js";

const repository = new UsuarioRepository();

export class UsuarioController {
  async criar(req: Request, res: Response) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Campos obrigatórios ausentes." });
    }

    try {
      const usuario = await repository.criar({ nome, email, senha });
      return res.status(201).json(usuario);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        if ((error as { code: string }).code === "P2002") {
          return res.status(409).json({ mensagem: "E-mail já registrado." });
        }
      }
      return res.status(500).json({ mensagem: "Erro ao criar usuário." });
    }
  }

  async login(req: Request, res: Response) {
    const { email, senha, lembrar } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: "Dados de acesso incompletos." });
    }

    try {
      const usuario = await repository.buscarPorEmail(email);

      if (!usuario || !(await argon2.verify(usuario.senha, senha))) {
        return res.status(401).json({ mensagem: "Credenciais inválidas." });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET!, {
        expiresIn: lembrar ? "30d" : "1d",
      });

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
  }

  async buscarPerfil(req: Request, res: Response) {
    const id = req.user!.id;
    const usuario = await repository.buscarPorId(id);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    return res.status(200).json(usuario);
  }

  async atualizarPerfil(req: Request, res: Response) {
    const id = req.user!.id;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ mensagem: "O nome é obrigatório." });
    }

    try {
      const usuario = await repository.atualizarNome(id, nome);
      return res
        .status(200)
        .json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao atualizar perfil." });
    }
  }

  async alterarSenhaInterna(req: Request, res: Response) {
    const id = req.user!.id;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res
        .status(400)
        .json({ mensagem: "Dados incompletos para alteração de senha." });
    }

    try {
      const usuario = await repository.buscarPorIdComSenha(id);

      if (!usuario || !(await argon2.verify(usuario.senha, senhaAtual))) {
        return res.status(401).json({ mensagem: "Senha atual incorreta." });
      }

      const hash = await argon2.hash(novaSenha);
      await repository.atualizarSenha(id, hash);

      return res.status(200).json({ mensagem: "Senha alterada com sucesso." });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao alterar a senha." });
    }
  }

  async deletarConta(req: Request, res: Response) {
    const id = req.user!.id;
    try {
      await repository.deletar(id);
      return res.status(200).json({ mensagem: "Conta excluída com sucesso." });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao excluir conta." });
    }
  }

  async recuperarSenha(req: Request, res: Response) {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ mensagem: "E-mail é obrigatório." });

    try {
      const usuario = await repository.buscarPorEmail(email);

      if (!usuario) {
        return res.status(200).json({
          mensagem: "Se o e-mail existir, você receberá as instruções.",
        });
      }

      const token = jwt.sign(
        { id: usuario.id, acao: "recuperar-senha" },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" },
      );

      return res.status(200).json({
        mensagem: "Link de recuperação gerado.",
        token,
        debugLink: `/redefinir-senha?token=${token}`,
      });
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno." });
    }
  }

  async redefinirSenha(req: Request, res: Response) {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res
        .status(400)
        .json({ mensagem: "Dados incompletos para redefinição." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
        acao: string;
      };

      if (decoded.acao !== "recuperar-senha") {
        return res.status(401).json({ mensagem: "Token inválido." });
      }

      const hash = await argon2.hash(novaSenha);
      await repository.atualizarSenha(decoded.id, hash);

      return res
        .status(200)
        .json({ mensagem: "Senha redefinida com sucesso." });
    } catch (error) {
      return res.status(401).json({ mensagem: "Link inválido ou expirado." });
    }
  }
}
