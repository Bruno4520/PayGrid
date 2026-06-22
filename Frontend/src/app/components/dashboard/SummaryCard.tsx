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
    <div className="bg-card text-card-foreground rounded-3xl p-5 md:p-6 border border-border/50 shadow-sm transition-colors duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center shrink-0`}
        >
          <Icon className={iconColor} size={24} />
        </div>

        {trend && (
          <span
            className={`flex items-center text-xs sm:text-sm font-bold px-2 py-1 rounded-md ${
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
        <p className="text-2xl font-bold tracking-tight truncate" title={value}>
          {value}
        </p>
      </div>

      {progressBar && (
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${progressBar.color}`}
              style={{ width: `${Math.min(progressBar.percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            {progressBar.percentage.toFixed(1)}% utilizado
          </p>
        </div>
      )}
    </div>
  );
}
