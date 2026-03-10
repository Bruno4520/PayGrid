import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/cadastro',
    Component: SignupPage,
  },
  {
    path: '/recuperar-senha',
    Component: ForgotPasswordPage,
  },
  {
    path: '/dashboard',
    Component: DashboardPage,
  },
  {
    path: '/transacoes',
    Component: DashboardPage, // Placeholder
  },
  {
    path: '/contas',
    Component: DashboardPage, // Placeholder
  },
  {
    path: '/cartoes',
    Component: DashboardPage, // Placeholder
  },
  {
    path: '/faturas',
    Component: DashboardPage, // Placeholder
  },
  {
    path: '/orcamentos',
    Component: DashboardPage, // Placeholder
  },
  {
    path: '/relatorios',
    Component: DashboardPage, // Placeholder
  },
  {
    path: '/simulador',
    Component: DashboardPage, // Placeholder
  },
  {
    path: '/configuracoes',
    Component: DashboardPage, // Placeholder
  },
  {
    path: '*',
    Component: LoginPage, // Redireciona para login se rota não encontrada
  },
]);