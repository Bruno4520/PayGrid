import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import {
  TransactionFilters,
  type FilterOptions,
} from "../components/transactions/TransactionFilters";
import {
  TransactionTable,
  type Transaction,
} from "../components/transactions/TransactionTable";
import { NewTransactionModal } from "../components/transactions/NewTransactionModal";
import { api } from "../../services/api";

export function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const querySearch = searchParams.get("q") || "";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    search: querySearch,
    period: "Todos",
    account: "Todas",
    category: "Todas",
    type: "Todos",
  });

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/transacoes");
      setTransactions(response.data);
    } catch (error) {
      toast.error("Erro ao carregar transações. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setTransactionToEdit(transaction);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      const transaction = transactions.find((t) => t.id === id);
      const isCredit = transaction?.formaPagamento === "CREDITO";
      const hasInstallments = (transaction?.parcelas?.length || 0) > 1;

      setDeletingId(id);

      if (isCredit && hasInstallments) {
        toast.info(
          "Excluindo transação e atualizando faturas. Este processo pode levar alguns segundos...",
          { duration: 5000 },
        );
      }

      try {
        await api.delete(`/transacoes/${id}`);
        toast.success("Transação excluída com sucesso.");
        fetchTransactions();
      } catch (error) {
        const message =
          isAxiosError(error) && error.response?.data?.mensagem
            ? error.response.data.mensagem
            : "Erro ao excluir transação. O servidor demorou muito para responder.";
        toast.error(message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const accounts = useMemo(() => {
    const accs = transactions.map(
      (t) => t.cartaoCredito?.nome || t.conta?.nome || "-",
    );
    return Array.from(new Set(accs))
      .filter((a) => a !== "-")
      .sort();
  }, [transactions]);

  const categories = useMemo(() => {
    const cats = transactions.map((t) => t.categoria?.nome || "-");
    return Array.from(new Set(cats))
      .filter((c) => c !== "-")
      .sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (
        filters.search &&
        !t.descricao.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      if (filters.type !== "Todos" && t.tipo !== filters.type) {
        return false;
      }

      const catName = t.categoria?.nome || "-";
      if (filters.category !== "Todas" && catName !== filters.category) {
        return false;
      }

      const accName = t.cartaoCredito?.nome || t.conta?.nome || "-";
      if (filters.account !== "Todas" && accName !== filters.account) {
        return false;
      }

      if (filters.period !== "Todos") {
        const txDate = new Date(t.data);
        txDate.setMinutes(txDate.getMinutes() + txDate.getTimezoneOffset());
        const now = new Date();

        if (filters.period === "Este mês") {
          if (
            txDate.getMonth() !== now.getMonth() ||
            txDate.getFullYear() !== now.getFullYear()
          )
            return false;
        } else if (filters.period === "Mês passado") {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          if (
            txDate.getMonth() !== lastMonth.getMonth() ||
            txDate.getFullYear() !== lastMonth.getFullYear()
          )
            return false;
        } else if (filters.period === "Este ano") {
          if (txDate.getFullYear() !== now.getFullYear()) return false;
        } else if (filters.period === "Últimos 30 dias") {
          const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000,
          );
          if (txDate < thirtyDaysAgo) return false;
        }
      }

      return true;
    });
  }, [transactions, filters]);

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Transações
            </h1>
            <p className="text-muted-foreground font-medium">
              Gerencie suas receitas e despesas
            </p>
          </div>

          <TransactionFilters
            onFilterChange={setFilters}
            accounts={accounts}
            categories={categories}
          />

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddTransaction}
              className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-sm"
            >
              <Plus size={20} /> Nova Transação
            </button>
          </div>

          <TransactionTable
            transactions={filteredTransactions}
            isLoading={isLoading}
            deletingId={deletingId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>
        <Footer />
      </div>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTransactionToEdit(null);
        }}
        onSave={() => fetchTransactions()}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}
