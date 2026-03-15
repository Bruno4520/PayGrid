import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface ReportSummaryCardProps {
  type: "income" | "expense" | "balance";
  value: number;
  percentageChange: number;
}

const typeConfig = {
  income: {
    label: "Total de Receitas",
    icon: TrendingUp,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  expense: {
    label: "Total de Despesas",
    icon: TrendingDown,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  balance: {
    label: "Saldo",
    icon: BarChart3,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
};

export function ReportSummaryCard({
  type,
  value,
  percentageChange,
}: ReportSummaryCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const isPositive = percentageChange > 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 ${config.iconBg} rounded-lg flex items-center justify-center`}
        >
          <Icon size={20} className={config.iconColor} />
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">{config.label}</p>
      <p className="text-2xl font-semibold text-gray-900 mb-2">
        {formatCurrency(value)}
      </p>

      <div className="flex items-center gap-1">
        <span
          className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
        >
          {isPositive ? "+" : ""}
          {percentageChange}%
        </span>
        <span className="text-sm text-gray-500">vs. mês anterior</span>
      </div>
    </div>
  );
}
