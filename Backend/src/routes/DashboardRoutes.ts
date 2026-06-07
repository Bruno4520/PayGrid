import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.use(authMiddleware);
dashboardRoutes.get("/", dashboardController.resumo.bind(dashboardController));

export { dashboardRoutes };
