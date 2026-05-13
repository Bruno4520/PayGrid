import { type LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  progressBar?: {
    percentage: number;
    color: string;
  };
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  trend,
  progressBar,
}: SummaryCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 border border-border/50 shadow-sm transition-colors duration-300">
      <div className="flex items-start justify-between mb-4">
        {/* O fundo recebe as classes dinâmicas, idealmente com opacidade (ex: bg-blue-500/10) */}
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}
        >
          <Icon className={iconColor} size={24} />
        </div>

        {trend && (
          <span
            className={`flex items-center text-sm font-medium px-2 py-1 rounded-md ${
              trend.isPositive
                ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
                : "text-red-600 bg-red-500/10 dark:text-red-400"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </div>

      {progressBar && (
        <div className="mt-4">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${progressBar.color} transition-all duration-500 ease-in-out`}
              style={{ width: `${progressBar.percentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
