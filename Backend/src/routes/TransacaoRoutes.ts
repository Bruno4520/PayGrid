import { Router } from "express";
import { TransacaoController } from "../controllers/TransacaoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const transacaoRoutes = Router();
const transacaoController = new TransacaoController();

transacaoRoutes.use(authMiddleware);

transacaoRoutes.get(
  "/",
  transacaoController.listarTodas.bind(transacaoController),
);
transacaoRoutes.post("/", transacaoController.criar.bind(transacaoController));
transacaoRoutes.get(
  "/conta/:contaId",
  transacaoController.listarPorConta.bind(transacaoController),
);
transacaoRoutes.put(
  "/:id",
  transacaoController.atualizar.bind(transacaoController),
);
transacaoRoutes.delete(
  "/:id",
  transacaoController.deletar.bind(transacaoController),
);

export { transacaoRoutes };
