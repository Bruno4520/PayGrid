import { Router } from "express";
import { SimulacaoController } from "../controllers/SimulacaoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const simulacaoRoutes = Router();
const simulacaoController = new SimulacaoController();

simulacaoRoutes.use(authMiddleware);
simulacaoRoutes.post(
  "/",
  simulacaoController.simular.bind(simulacaoController),
);
simulacaoRoutes.get("/", simulacaoController.listar.bind(simulacaoController));

export { simulacaoRoutes };
