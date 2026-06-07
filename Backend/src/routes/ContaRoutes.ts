import { Router } from "express";
import { ContaController } from "../controllers/ContaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const contaRoutes = Router();
const controller = new ContaController();

contaRoutes.use(authMiddleware);

contaRoutes.post("/", controller.criar.bind(controller));
contaRoutes.get("/", controller.listar.bind(controller));
contaRoutes.put("/:id", controller.atualizar.bind(controller));
contaRoutes.delete("/:id", controller.deletar.bind(controller));

export { contaRoutes };
