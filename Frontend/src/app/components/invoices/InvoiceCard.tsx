interface InvoiceCardProps {
  month: string;
  year: number;
  status: "paid" | "closed" | "open";
  dueDate: string;
  totalAmount: number;
  purchasesCount: number;
  isActive?: boolean;
  onClick?: () => void;
}

const statusConfig = {
  paid: {
    label: "Paga",
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  closed: {
    label: "Fechada",
    color: "text-red-600 dark:text-red-400 bg-red-500/10",
  },
  open: {
    label: "Aberta",
    color: "text-[#2B5BBA] dark:text-[#5588ff] bg-blue-500/10",
  },
};

export function InvoiceCard({
  month,
  year,
  status,
  dueDate,
  totalAmount,
  purchasesCount,
  isActive,
  onClick,
}: InvoiceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const statusInfo = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={`bg-card text-card-foreground rounded-3xl p-6 shadow-sm border transition-all duration-300 text-left w-full hover:shadow-md ${
        isActive
          ? "border-transparent ring-2 ring-offset-2 ring-[#2B5BBA] dark:ring-offset-zinc-900 scale-[1.02]"
          : "border-border/50 hover:border-border hover:scale-[1.01]"
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          {month} {year}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <span className="text-sm font-medium text-muted-foreground">
            Vencimento
          </span>
          <span className="text-sm font-semibold text-foreground">
            {dueDate}
          </span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <span className="text-sm font-medium text-muted-foreground">
            Valor Total
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-medium text-muted-foreground">
            Compras
          </span>
          <span className="text-sm font-medium text-foreground">
            {purchasesCount} transações
          </span>
        </div>
      </div>
    </button>
  );
}
