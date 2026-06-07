import { Router } from "express";
import { OrcamentoController } from "../controllers/OrcamentoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const orcamentoRoutes = Router();
const orcamentoController = new OrcamentoController();

orcamentoRoutes.use(authMiddleware);
orcamentoRoutes.post(
  "/",
  orcamentoController.definir.bind(orcamentoController),
);
orcamentoRoutes.get("/", orcamentoController.listar.bind(orcamentoController));
orcamentoRoutes.delete(
  "/:categoriaId/:mes/:ano",
  orcamentoController.deletar.bind(orcamentoController),
);

export { orcamentoRoutes };
