import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

interface RecentTransactionsProps {
  onAddTransaction: () => void;
  onViewAll: () => void;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Supermercado Extra",
    category: "Alimentação",
    amount: 450.9,
    type: "expense",
    date: "Hoje",
  },
  {
    id: "2",
    title: "Salário Mensal",
    category: "Receitas",
    amount: 4200.0,
    type: "income",
    date: "Ontem",
  },
  {
    id: "3",
    title: "Uber",
    category: "Transporte",
    amount: 35.5,
    type: "expense",
    date: "Ontem",
  },
  {
    id: "4",
    title: "Netflix",
    category: "Lazer",
    amount: 39.9,
    type: "expense",
    date: "12 de Mai",
  },
];

export function RecentTransactions({ onViewAll }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border/50 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold tracking-tight">
          Transações Recentes
        </h3>
        <button
          onClick={onViewAll}
          className="text-sm font-medium text-[#2B5BBA] hover:text-[#1e4594] dark:hover:text-[#5588ff] transition-colors"
        >
          Ver todas
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {mockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-full ${transaction.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
              >
                {transaction.type === "income" ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <ArrowDownRight size={20} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {transaction.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} • {transaction.date}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-bold ${transaction.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}
            >
              {transaction.type === "income" ? "+" : "-"}{" "}
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
