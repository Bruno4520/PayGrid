import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

interface ReportSummaryCardProps {
  type: "income" | "expense" | "balance";
  value: number;
  percentageChange: number;
}

const typeConfig: Record<
  string,
  { label: string; icon: LucideIcon; iconBg: string; iconColor: string }
> = {
  income: {
    label: "Total de Receitas",
    icon: TrendingUp,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  expense: {
    label: "Total de Despesas",
    icon: TrendingDown,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
  },
  balance: {
    label: "Saldo",
    icon: BarChart3,
    iconBg: "bg-[#2B5BBA]/10",
    iconColor: "text-[#2B5BBA] dark:text-[#5588ff]",
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
    <div className="bg-card rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <div className="flex items-start justify-between mb-4 md:mb-5">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 ${config.iconBg} rounded-xl flex items-center justify-center shrink-0`}
        >
          <Icon className={`${config.iconColor} w-5 h-5 sm:w-6 sm:h-6`} />
        </div>
      </div>

      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">
        {config.label}
      </p>
      <p
        className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 truncate"
        title={formatCurrency(value)}
      >
        {formatCurrency(value)}
      </p>

      <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/50">
        <span
          className={`text-xs sm:text-sm font-bold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
        >
          {isPositive ? "+" : ""}
          {percentageChange}%
        </span>
        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
          vs. período anterior
        </span>
      </div>
    </div>
  );
}
