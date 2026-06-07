import { Router } from "express";
import { CategoriaController } from "../controllers/CategoriaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const categoriaRoutes = Router();
const categoriaController = new CategoriaController();

categoriaRoutes.use(authMiddleware);
categoriaRoutes.post("/", categoriaController.criar.bind(categoriaController));
categoriaRoutes.get("/", categoriaController.listar.bind(categoriaController));
categoriaRoutes.put(
  "/:id",
  categoriaController.atualizar.bind(categoriaController),
);
categoriaRoutes.delete(
  "/:id",
  categoriaController.deletar.bind(categoriaController),
);

export { categoriaRoutes };
