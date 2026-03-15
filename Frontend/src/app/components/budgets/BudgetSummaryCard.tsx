import { Target, TrendingUp, PiggyBank, type LucideIcon } from "lucide-react";

interface BudgetSummaryCardProps {
  type: "planned" | "spent" | "available";
  value: number;
}

const typeConfig: Record<
  string,
  {
    label: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    textColor: string;
  }
> = {
  planned: {
    label: "Total Planejado",
    icon: Target,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    textColor: "text-gray-900",
  },
  spent: {
    label: "Total Gasto",
    icon: TrendingUp,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    textColor: "text-gray-900",
  },
  available: {
    label: "Disponível",
    icon: PiggyBank,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    textColor: "text-green-600",
  },
};

export function BudgetSummaryCard({ type, value }: BudgetSummaryCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div
        className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center mb-4`}
      >
        <Icon size={24} className={config.iconColor} />
      </div>
      <p className="text-sm text-gray-600 mb-2">{config.label}</p>
      <p className={`text-2xl font-semibold ${config.textColor}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}
