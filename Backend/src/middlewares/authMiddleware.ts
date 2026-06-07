import jwt, { type JwtPayload } from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";

interface AuthPayload extends JwtPayload {
  id: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensagem: "Token de acesso ausente." });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error(
      "Configuração de segurança (JWT_SECRET) ausente no servidor.",
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Sessão inválida ou expirada." });
  }
};
