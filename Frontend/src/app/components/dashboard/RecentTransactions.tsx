import { ArrowDownRight, ArrowUpRight, ReceiptText } from "lucide-react";

export interface DashboardTransaction {
  id: number;
  descricao: string;
  valor: number;
  tipo: "RECEITA" | "DESPESA";
  data: string;
  categoria?: {
    nome: string;
  };
  parcelas?: unknown[];
}

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
  onViewAll: () => void;
}

export function RecentTransactions({
  transactions,
  onViewAll,
}: RecentTransactionsProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);

  return (
    <div className="bg-card text-card-foreground rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold tracking-tight">
          Transações Recentes
        </h3>
        <button
          onClick={onViewAll}
          className="text-sm font-bold text-[#2B5BBA] hover:underline transition-colors"
        >
          Ver todas
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  t.tipo === "RECEITA"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {t.tipo === "RECEITA" ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <ArrowDownRight size={20} />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                  {t.descricao}
                  {t.parcelas && t.parcelas.length > 1 && (
                    <span className="text-[10px] font-bold bg-[#2B5BBA]/10 text-[#2B5BBA] px-1.5 py-0.5 rounded-md">
                      {t.parcelas.length}x
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {t.categoria?.nome || "Outros"} •{" "}
                  {new Date(t.data).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-bold ${
                t.tipo === "RECEITA"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {t.tipo === "RECEITA" ? "+" : "-"} {formatCurrency(t.valor)}
            </span>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
            <ReceiptText size={32} className="mb-3 opacity-20" />
            <p className="font-medium">Nenhuma transação recente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
