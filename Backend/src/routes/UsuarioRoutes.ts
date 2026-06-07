import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const usuarioRoutes = Router();
const controller = new UsuarioController();

usuarioRoutes.post("/", controller.criar.bind(controller));
usuarioRoutes.post("/login", controller.login.bind(controller));
usuarioRoutes.post(
  "/recuperar-senha",
  controller.recuperarSenha.bind(controller),
);
usuarioRoutes.post(
  "/redefinir-senha",
  controller.redefinirSenha.bind(controller),
);

usuarioRoutes.get(
  "/perfil",
  authMiddleware,
  controller.buscarPerfil.bind(controller),
);
usuarioRoutes.put(
  "/perfil",
  authMiddleware,
  controller.atualizarPerfil.bind(controller),
);
usuarioRoutes.put(
  "/senha",
  authMiddleware,
  controller.alterarSenhaInterna.bind(controller),
);
usuarioRoutes.delete(
  "/conta",
  authMiddleware,
  controller.deletarConta.bind(controller),
);

export { usuarioRoutes };
