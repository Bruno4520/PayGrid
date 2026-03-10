import type { LucideIcon } from "lucide-react";

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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}
        >
          <Icon className={iconColor} size={24} />
        </div>
        {trend && (
          <span
            className={`text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      {progressBar && (
        <div className="mt-4">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressBar.color} transition-all duration-300`}
              style={{ width: `${progressBar.percentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
