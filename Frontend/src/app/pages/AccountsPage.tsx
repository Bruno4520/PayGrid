import { useState, useEffect } from "react";
import { Plus, GripHorizontal } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { AccountCard } from "../components/accounts/AccountCard";
import {
  AccountStatement,
  type StatementTransaction,
} from "../components/accounts/AccountStatement";
import {
  NewAccountModal,
  type AccountData,
  type ExtendedAccount,
} from "../components/accounts/NewAccountModal";
import { NewTransactionModal } from "../components/transactions/NewTransactionModal";
import { api } from "../../services/api";
import type { Transaction } from "../components/transactions/TransactionTable";

const backendTypeMap = {
  checking: "CONTA_CORRENTE",
  savings: "POUPANCA",
  wallet: "CARTEIRA",
} as const;

const frontendTypeMap: Record<string, ExtendedAccount["type"]> = {
  CONTA_CORRENTE: "checking",
  POUPANCA: "savings",
  CARTEIRA: "wallet",
};

const typeNameMap: Record<string, string> = {
  CONTA_CORRENTE: "Conta Corrente",
  POUPANCA: "Poupança",
  CARTEIRA: "Carteira Física",
};

export function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<ExtendedAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [accountToEdit, setAccountToEdit] = useState<ExtendedAccount | null>(
    null,
  );
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(
    null,
  );
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    number | null
  >(null);

  const fetchAccountsAndTransactions = async () => {
    try {
      setLoading(true);
      const [accountsRes, transactionsRes] = await Promise.all([
        api.get("/contas"),
        api.get("/transacoes"),
      ]);

      const adaptedAccounts = accountsRes.data.map(
        (acc: any): ExtendedAccount => ({
          id: String(acc.id),
          name: acc.nome,
          balance: acc.saldo,
          type: frontendTypeMap[acc.tipo],
          typeName: typeNameMap[acc.tipo],
          icon: acc.tipo,
          agency: acc.agencia,
          accountNumber: acc.numeroConta,
          details:
            acc.tipo === "CARTEIRA"
              ? "Dinheiro em espécie"
              : `Ag: ${acc.agencia} • Cc: ${acc.numeroConta}`,
        }),
      );

      const savedOrder = JSON.parse(
        localStorage.getItem("@financas:accountsOrder") || "[]",
      );
      if (savedOrder.length > 0) {
        adaptedAccounts.sort((a: ExtendedAccount, b: ExtendedAccount) => {
          const idxA = savedOrder.indexOf(a.id);
          const idxB = savedOrder.indexOf(b.id);
          return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
        });
      }

      setAccounts(adaptedAccounts);
      setTransactions(transactionsRes.data);
    } catch (error) {
      toast.error("Erro ao buscar dados das contas e transações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsAndTransactions();
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) return;

    const newAccounts = [...accounts];
    const draggedItem = newAccounts.splice(draggedIdx, 1)[0];
    newAccounts.splice(dropIdx, 0, draggedItem);

    setAccounts(newAccounts);
    localStorage.setItem(
      "@financas:accountsOrder",
      JSON.stringify(newAccounts.map((a) => a.id)),
    );
    setDraggedIdx(null);
  };

  const handleAddAccount = () => {
    setAccountToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditAccount = (id: string) => {
    const account = accounts.find((a) => a.id === id);
    if (account) {
      setAccountToEdit(account);
      setIsModalOpen(true);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta conta? Todas as transações vinculadas serão apagadas.",
      )
    ) {
      setDeletingAccountId(id);
      toast.info("A excluir a conta e os seus registos...");
      try {
        await api.delete(`/contas/${id}`);
        toast.success("Conta excluída com sucesso.");
        if (activeFilter === id) setActiveFilter("all");
        fetchAccountsAndTransactions();
      } catch (error) {
        const message =
          isAxiosError(error) && error.response?.data?.mensagem
            ? error.response.data.mensagem
            : "Não foi possível excluir a conta.";
        toast.error(message);
      } finally {
        setDeletingAccountId(null);
      }
    }
  };

  const handleSaveAccount = async (data: AccountData) => {
    try {
      const payload = {
        nome: data.name,
        saldo: data.balance,
        tipo: backendTypeMap[data.type],
        agencia: data.agency,
        numeroConta: data.accountNumber,
      };

      if (accountToEdit) {
        await api.put(`/contas/${accountToEdit.id}`, payload);
        toast.success("Conta atualizada com sucesso.");
      } else {
        await api.post("/contas", payload);
        toast.success("Conta criada com sucesso.");
      }

      await fetchAccountsAndTransactions();
      setIsModalOpen(false);
      setAccountToEdit(null);
    } catch (error) {
      toast.error("Erro ao salvar os dados da conta.");
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta movimentação?")) {
      setDeletingTransactionId(transactionId);
      try {
        await api.delete(`/transacoes/${transactionId}`);
        toast.success("Movimentação excluída.");
        fetchAccountsAndTransactions();
      } catch (error) {
        toast.error("Erro ao excluir transação.");
      } finally {
        setDeletingTransactionId(null);
      }
    }
  };

  const filteredTransactions: StatementTransaction[] = transactions
    .filter((t) => {
      if (t.cartaoCreditoId && t.formaPagamento === "CREDITO") return false;
      if (activeFilter === "all") return true;
      return t.contaId === Number(activeFilter);
    })
    .map((t) => {
      const dateObj = new Date(t.data);
      dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
      return {
        id: t.id,
        descricao: t.descricao,
        valor: t.valor,
        tipo: t.tipo,
        formaPagamento: t.formaPagamento,
        categoria: t.categoria,
        dateFormatted: dateObj.toLocaleDateString("pt-BR"),
        timeFormatted: new Date(t.data).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        accountName:
          accounts.find((a) => a.id === String(t.contaId))?.name ||
          "Desconhecida",
      };
    });

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
                Minhas Contas
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-medium">
                Controle os seus saldos e extratos consolidados
              </p>
            </div>
            <button
              onClick={handleAddAccount}
              disabled={loading}
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl hover:opacity-90 font-medium transition-opacity shadow-sm disabled:opacity-50"
            >
              <Plus size={20} /> Nova Conta
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground animate-pulse">
              Carregando os seus dados financeiros...
            </div>
          ) : (
            <>
              {accounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8 md:mb-10">
                  {accounts.map((account, index) => {
                    const isSelected = activeFilter === account.id;
                    const isAll = activeFilter === "all";

                    return (
                      <div
                        key={account.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={() => setDraggedIdx(null)}
                        onClick={() =>
                          setActiveFilter((prev) =>
                            prev === account.id ? "all" : account.id,
                          )
                        }
                        className={`group relative cursor-grab active:cursor-grabbing transition-all duration-300 ${draggedIdx === index ? "opacity-40 scale-95" : "opacity-100"}`}
                      >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card border border-border text-muted-foreground p-1.5 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity z-10 shadow-sm">
                          <GripHorizontal size={16} />
                        </div>
                        <div
                          className={`transition-all duration-300 ${
                            isSelected
                              ? "scale-[1.02] shadow-lg ring-2 ring-offset-2 ring-[#2B5BBA] dark:ring-offset-zinc-900 rounded-3xl opacity-100"
                              : isAll
                                ? "opacity-100 hover:scale-[1.01]"
                                : "opacity-50 hover:opacity-80"
                          }`}
                        >
                          <AccountCard
                            id={account.id}
                            type={account.type}
                            name={account.name}
                            balance={account.balance}
                            badge={account.typeName}
                            details={account.details}
                            onEdit={handleEditAccount}
                            onDelete={handleDeleteAccount}
                            isDeleting={deletingAccountId === account.id}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-3xl border border-border/50 mb-8 md:mb-10">
                  <h2 className="text-xl font-bold mb-2">
                    Nenhuma conta cadastrada
                  </h2>
                  <p className="text-muted-foreground">
                    Adicione uma conta para começar a organizar o seu dinheiro.
                  </p>
                </div>
              )}

              <AccountStatement
                transactions={filteredTransactions}
                activeFilter={activeFilter}
                accountName={accounts.find((a) => a.id === activeFilter)?.name}
                deletingTransactionId={deletingTransactionId}
                onNewTransaction={() => {
                  setTransactionToEdit(null);
                  setIsTransactionModalOpen(true);
                }}
                onEditTransaction={(t) => {
                  const fullTransaction = transactions.find(
                    (tx) => tx.id === t.id,
                  );
                  if (fullTransaction) {
                    setTransactionToEdit(fullTransaction);
                    setIsTransactionModalOpen(true);
                  }
                }}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </>
          )}
        </main>
        <Footer />
      </div>

      <NewAccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAccountToEdit(null);
        }}
        onSave={handleSaveAccount}
        accountToEdit={accountToEdit}
      />

      <NewTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setTransactionToEdit(null);
        }}
        initialType="despesa"
        initialPaymentMethod="pix"
        initialAccount={activeFilter !== "all" ? activeFilter : ""}
        transactionToEdit={transactionToEdit}
        onSave={() => fetchAccountsAndTransactions()}
      />
    </div>
  );
}
