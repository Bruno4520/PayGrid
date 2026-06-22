import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Wallet, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { SummaryCard } from "../components/dashboard/SummaryCard";
import { WelcomeBanner } from "../components/dashboard/WelcomeBanner";
import {
  RecentTransactions,
  type DashboardTransaction,
} from "../components/dashboard/RecentTransactions";
import { QuickActions } from "../components/dashboard/QuickActions";
import {
  MonthlyOverview,
  type MonthlyData,
} from "../components/dashboard/MonthlyOverview";
import {
  ExpensesByCategory,
  type CategoryData,
} from "../components/dashboard/ExpensesByCategory";
import { Footer } from "../components/dashboard/Footer";
import { NewTransactionModal } from "../components/transactions/NewTransactionModal";
import { api } from "../../services/api";
import { useAuth } from "../contexts/AuthContext";

interface DashboardData {
  saldoTotal: number;
  receitasMesAtual: number;
  despesasMesAtual: number;
  limiteTotal: number;
  limiteUsado: number;
  totalTransacoes: number;
  transacoesRecentes: DashboardTransaction[];
  graficoMensal: MonthlyData[];
  graficoCategorias: CategoryData[];
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Olá");

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"receita" | "despesa">(
    "receita",
  );
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Bom dia");
    else if (hour >= 12 && hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get<DashboardData>("/dashboard");
      setData(response.data);
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Não foi possível carregar os dados do painel.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNewIncome = () => {
    setTransactionType("receita");
    setPaymentMethod("");
    setIsTransactionModalOpen(true);
  };

  const handleNewExpense = () => {
    setTransactionType("despesa");
    setPaymentMethod("");
    setIsTransactionModalOpen(true);
  };

  const handleTransfer = () => {
    setTransactionType("despesa");
    setPaymentMethod("pix");
    setIsTransactionModalOpen(true);
  };

  const handlePayInvoice = () => {
    navigate("/faturas");
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  if (loading || !data) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <p className="text-muted-foreground font-medium animate-pulse">
          A carregar o seu painel...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
              {greeting}, {user?.nome?.split(" ")[0] || "Usuário"}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Aqui está o resumo das suas finanças de hoje
            </p>
          </div>

          {data.totalTransacoes === 0 && (
            <div className="mb-6 md:mb-8">
              <WelcomeBanner
                userName={user?.nome?.split(" ")[0] || "Usuário"}
                hasTransactions={data.totalTransacoes > 0}
                onAddTransaction={handleNewIncome}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <SummaryCard
              title="Saldo Total"
              value={formatCurrency(data.saldoTotal)}
              icon={Wallet}
              iconBgColor="bg-[#2B5BBA]/10"
              iconColor="text-[#2B5BBA] dark:text-[#5588ff]"
            />
            <SummaryCard
              title="Receitas no Mês"
              value={formatCurrency(data.receitasMesAtual)}
              icon={TrendingUp}
              iconBgColor="bg-emerald-500/10"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <SummaryCard
              title="Despesas no Mês"
              value={formatCurrency(data.despesasMesAtual)}
              icon={TrendingDown}
              iconBgColor="bg-red-500/10"
              iconColor="text-red-600 dark:text-red-400"
            />
            <SummaryCard
              title="Cartões de Crédito"
              value={formatCurrency(data.limiteUsado)}
              icon={CreditCard}
              iconBgColor="bg-purple-500/10"
              iconColor="text-purple-600 dark:text-purple-400"
              progressBar={{
                percentage:
                  data.limiteTotal > 0
                    ? (data.limiteUsado / data.limiteTotal) * 100
                    : 0,
                color: "bg-purple-500",
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentTransactions
                transactions={data.transacoesRecentes}
                onViewAll={() => navigate("/transacoes")}
              />
            </div>
            <div>
              <QuickActions
                onNewIncome={handleNewIncome}
                onNewExpense={handleNewExpense}
                onTransfer={handleTransfer}
                onPayInvoice={handlePayInvoice}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyOverview data={data.graficoMensal} />
            <ExpensesByCategory data={data.graficoCategorias} />
          </div>
        </main>
        <Footer />
      </div>

      <NewTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        initialType={transactionType}
        initialPaymentMethod={paymentMethod}
        onSave={() => {
          setIsTransactionModalOpen(false);
          fetchDashboardData();
        }}
      />
    </div>
  );
}
