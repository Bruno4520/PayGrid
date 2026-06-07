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
  }
> = {
  planned: {
    label: "Total Planejado",
    icon: Target,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  spent: {
    label: "Total Gasto",
    icon: TrendingUp,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  available: {
    label: "Disponível",
    icon: PiggyBank,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
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

  let valueColor = "text-foreground";
  let iconBgColor = config.iconBg;
  let iconColor = config.iconColor;

  if (type === "available") {
    if (value < 0) {
      valueColor = "text-red-600 dark:text-red-400";
      iconBgColor = "bg-red-500/10";
      iconColor = "text-red-600 dark:text-red-400";
    } else {
      valueColor = "text-emerald-600 dark:text-emerald-400";
      iconBgColor = "bg-emerald-500/10";
      iconColor = "text-emerald-600 dark:text-emerald-400";
    }
  }

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColor} transition-colors`}
        >
          <Icon className={iconColor} size={24} />
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {config.label}
        </p>
      </div>
      <p
        className={`text-3xl font-bold tracking-tight transition-colors ${valueColor}`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}
