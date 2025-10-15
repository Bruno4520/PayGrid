import { Router } from 'express';
import { OrcamentoController } from '../controllers/OrcamentoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const orcamentoRoutes = Router();
const orcamentoController = new OrcamentoController();

orcamentoRoutes.use(authMiddleware);
orcamentoRoutes.post('/', orcamentoController.definir);
orcamentoRoutes.get('/', orcamentoController.listar);

export { orcamentoRoutes };