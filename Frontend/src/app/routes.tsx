import { createBrowserRouter } from "react-router";
import { PrivateRoute } from "./PrivateRoute";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { AccountsPage } from "./pages/AccountsPage";
import { CardsPage } from "./pages/CardsPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { BudgetsPage } from "./pages/BudgetsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SimulatorPage } from "./pages/SimulatorPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },
  { path: "/login", Component: LoginPage },
  { path: "/cadastro", Component: SignupPage },
  { path: "/recuperar-senha", Component: ForgotPasswordPage },
  { path: "/redefinir-senha", Component: ResetPasswordPage },
  {
    element: <PrivateRoute />,
    children: [
      { path: "/dashboard", Component: DashboardPage },
      { path: "/transacoes", Component: TransactionsPage },
      { path: "/contas", Component: AccountsPage },
      { path: "/cartoes", Component: CardsPage },
      { path: "/faturas", Component: InvoicesPage },
      { path: "/orcamentos", Component: BudgetsPage },
      { path: "/relatorios", Component: ReportsPage },
      { path: "/simulador", Component: SimulatorPage },
      { path: "/categorias", Component: DashboardPage },
      { path: "/configuracoes", Component: SettingsPage },
    ],
  },
  { path: "*", Component: LoginPage },
]);
