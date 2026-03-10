import { Wallet, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { QuickActions } from '../components/dashboard/QuickActions';
import { MonthlyOverview } from '../components/dashboard/MonthlyOverview';
import { ExpensesByCategory } from '../components/dashboard/ExpensesByCategory';
import { Footer } from '../components/dashboard/Footer';

export function DashboardPage() {
  const handleAddTransaction = () => {
    console.log('Adicionar transação');
  };

  const handleViewAllTransactions = () => {
    console.log('Ver todas as transações');
  };

  const handleNewIncome = () => {
    console.log('Nova receita');
  };

  const handleNewExpense = () => {
    console.log('Nova despesa');
  };

  const handleTransfer = () => {
    console.log('Transferência');
  };

  const handleCreateBudget = () => {
    console.log('Criar orçamento');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard Financeiro</h1>
            <p className="text-gray-600">Visão geral das suas finanças em tempo real</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              title="Saldo em Conta"
              value="R$ 2.450,00"
              icon={Wallet}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
              trend={{ value: '3.2%', isPositive: true }}
            />
            <SummaryCard
              title="Receitas do Mês"
              value="R$ 4.200,00"
              icon={TrendingUp}
              iconBgColor="bg-green-50"
              iconColor="text-green-600"
              trend={{ value: '6%', isPositive: true }}
            />
            <SummaryCard
              title="Despesas do Mês"
              value="R$ 1.750,00"
              icon={TrendingDown}
              iconBgColor="bg-red-50"
              iconColor="text-red-600"
              trend={{ value: '5%', isPositive: false }}
            />
            <SummaryCard
              title="Crédito Disponível"
              value="R$ 3.500,00"
              icon={CreditCard}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
              progressBar={{ percentage: 70, color: 'bg-purple-500' }}
            />
          </div>

          {/* Welcome Banner */}
          <div className="mb-8">
            <WelcomeBanner onAddTransaction={handleAddTransaction} />
          </div>

          {/* Transactions and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentTransactions
                onAddTransaction={handleAddTransaction}
                onViewAll={handleViewAllTransactions}
              />
            </div>
            <div>
              <QuickActions
                onNewIncome={handleNewIncome}
                onNewExpense={handleNewExpense}
                onTransfer={handleTransfer}
                onCreateBudget={handleCreateBudget}
              />
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyOverview />
            <ExpensesByCategory />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
