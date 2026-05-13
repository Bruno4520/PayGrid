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
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-foreground",
  },
  spent: {
    label: "Total Gasto",
    icon: TrendingUp,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
    textColor: "text-foreground",
  },
  available: {
    label: "Disponível",
    icon: PiggyBank,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    textColor: "text-emerald-600 dark:text-emerald-400",
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
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <div
        className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center mb-5`}
      >
        <Icon size={24} className={config.iconColor} />
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">
        {config.label}
      </p>
      <p className={`text-3xl font-bold tracking-tight ${config.textColor}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}
