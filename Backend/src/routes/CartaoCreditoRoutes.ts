import { Router } from "express";
import { CartaoCreditoController } from "../controllers/CartaoCreditoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const cartaoCreditoRoutes = Router();
const cartaoController = new CartaoCreditoController();

cartaoCreditoRoutes.use(authMiddleware);

cartaoCreditoRoutes.post("/", cartaoController.criar.bind(cartaoController));
cartaoCreditoRoutes.get("/", cartaoController.listar.bind(cartaoController));
cartaoCreditoRoutes.put(
  "/:id",
  cartaoController.atualizar.bind(cartaoController),
);
cartaoCreditoRoutes.delete(
  "/:id",
  cartaoController.deletar.bind(cartaoController),
);
cartaoCreditoRoutes.get(
  "/:id/faturas",
  cartaoController.listarFaturas.bind(cartaoController),
);

export { cartaoCreditoRoutes };
