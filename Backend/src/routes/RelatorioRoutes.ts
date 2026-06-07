import { Router } from "express";
import { RelatorioController } from "../controllers/RelatorioController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const relatorioRoutes = Router();
const relatorioController = new RelatorioController();

relatorioRoutes.use(authMiddleware);
relatorioRoutes.get(
  "/",
  relatorioController.obterDados.bind(relatorioController),
);

export { relatorioRoutes };
