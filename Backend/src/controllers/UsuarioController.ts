import { type Request, type Response } from 'express';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { type JwtPayload } from 'jsonwebtoken';

const usuarioRepository = new UsuarioRepository();

export class UsuarioController {

  async criar(req: Request, res: Response) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios.' });
    }

    try {
      const novoUsuario = await usuarioRepository.criar({ nome, email, senha });
      return res.status(201).json(novoUsuario);

    } catch (error: any) {
      console.error("ERRO AO CRIAR USUÁRIO:", error);
      if (error.code === 'P2002') {
        return res.status(409).json({ mensagem: 'Este email já está em uso.' });
      }
      return res.status(500).json({ mensagem: 'Erro usuario 1' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    try {
      const usuario = await usuarioRepository.buscarPorEmail(email);
      if (!usuario) {
        return res.status(400).json({ mensagem: 'Credenciais inválidas.' });
      }

      const senhaValida = await argon2.verify(usuario.senha, senha);
      if (!senhaValida) {
        return res.status(400).json({ mensagem: 'Credenciais inválidas.' });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não definido');
      }

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({ token });

    } catch (error) {
      console.error("ERRO NO LOGIN:", error);
      return res.status(500).json({ mensagem: 'Erro usuario 2' });
    }
  }

  async buscarPerfil(req: Request, res: Response) {

    try {
      const payload = (req as any).user as JwtPayload;
      const usuarioId = payload.id;

      if (!usuarioId) {
        return res.status(400).json({ mensagem: 'ID do usuário não encontrado no token.' });
      }

      const usuario = await usuarioRepository.buscarPorId(usuarioId);
      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      }
      return res.status(200).json(usuario);

    } catch (error) {
      console.error("ERRO AO BUSCAR PERFIL:", error);
      return res.status(500).json({ mensagem: 'Erro usuario 3' });
    }
  }
}