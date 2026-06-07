interface InvoiceCardProps {
  cardName: string;
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
  cardName,
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
      className={`relative text-card-foreground rounded-3xl p-6 transition-all duration-300 text-left w-full border-2 ${
        isActive
          ? "border-[#2B5BBA] bg-blue-500/5 shadow-md scale-[1.02]"
          : "border-border/50 bg-card hover:border-border hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {month} {year}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            {cardName}
          </p>
        </div>
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
            {purchasesCount} {purchasesCount === 1 ? "item" : "itens"}
          </span>
        </div>
      </div>
    </button>
  );
}
