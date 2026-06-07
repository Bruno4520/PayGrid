import "dotenv/config";
import express from "express";
import cors from "cors";
import { usuarioRoutes } from "./routes/UsuarioRoutes.js";
import { contaRoutes } from "./routes/ContaRoutes.js";
import { categoriaRoutes } from "./routes/CategoriaRoutes.js";
import { transacaoRoutes } from "./routes/TransacaoRoutes.js";
import { cartaoCreditoRoutes } from "./routes/CartaoCreditoRoutes.js";
import { orcamentoRoutes } from "./routes/OrcamentoRoutes.js";
import { faturaRoutes } from "./routes/FaturaRoutes.js";
import { simulacaoRoutes } from "./routes/SimulacaoRoutes.js";
import { dashboardRoutes } from "./routes/DashboardRoutes.js";
import { relatorioRoutes } from "./routes/RelatorioRoutes.js";
import { notificacaoRoutes } from "./routes/NotificacaoRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:5173"],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "paygrid-api",
  });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/notificacoes", notificacaoRoutes);
app.use("/api/contas", contaRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/transacoes", transacaoRoutes);
app.use("/api/cartoes", cartaoCreditoRoutes);
app.use("/api/orcamentos", orcamentoRoutes);
app.use("/api/faturas", faturaRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/simulacoes", simulacaoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});