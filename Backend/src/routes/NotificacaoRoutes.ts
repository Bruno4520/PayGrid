import { Router } from "express";
import { NotificacaoController } from "../controllers/NotificacaoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const notificacaoRoutes = Router();
const notificacaoController = new NotificacaoController();

notificacaoRoutes.use(authMiddleware);
notificacaoRoutes.get(
  "/",
  notificacaoController.listar.bind(notificacaoController),
);

export { notificacaoRoutes };
