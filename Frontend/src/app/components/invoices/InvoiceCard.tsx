interface InvoiceCardProps {
  month: string;
  year: number;
  status: "paid" | "closed" | "open";
  dueDate: string;
  totalAmount: number;
  purchasesCount: number;
  onClick?: () => void;
}

const statusConfig = {
  paid: {
    label: "Paga",
    color: "text-green-600 bg-green-50",
  },
  closed: {
    label: "Fechada",
    color: "text-red-600 bg-red-50",
  },
  open: {
    label: "Aberta",
    color: "text-blue-600 bg-blue-50",
  },
};

export function InvoiceCard({
  month,
  year,
  status,
  dueDate,
  totalAmount,
  purchasesCount,
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
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {month} {year}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Vencimento</span>
          <span className="text-sm font-medium text-gray-900">{dueDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Valor Total</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Compras</span>
          <span className="text-sm text-gray-900">
            {purchasesCount} transações
          </span>
        </div>
      </div>
    </button>
  );
}
