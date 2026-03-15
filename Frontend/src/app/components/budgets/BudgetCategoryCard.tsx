import {
  Home,
  Utensils,
  Car,
  Heart,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";

interface BudgetCategoryCardProps {
  category: string;
  icon: "home" | "food" | "car" | "health" | "game";
  iconColor: string;
  iconBg: string;
  status: "within" | "exceeded";
  planned: number;
  spent: number;
}

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  food: Utensils,
  car: Car,
  health: Heart,
  game: Gamepad2,
};

export function BudgetCategoryCard({
  category,
  icon,
  iconColor,
  iconBg,
  status,
  planned,
  spent,
}: BudgetCategoryCardProps) {
  const Icon = iconMap[icon];
  const percentage = (spent / planned) * 100;
  const isExceeded = status === "exceeded";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}
          >
            <Icon size={24} className={iconColor} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {category}
            </h3>
            <p
              className={`text-xs font-medium ${isExceeded ? "text-red-600" : "text-green-600"}`}
            >
              {isExceeded ? "Excedido" : "Dentro do orçamento"}
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Planejado</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(planned)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Gasto</span>
          <span
            className={`text-sm font-semibold ${isExceeded ? "text-red-600" : "text-gray-900"}`}
          >
            {formatCurrency(spent)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isExceeded ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 text-right">
          {Math.round(percentage)}% utilizado
        </p>
      </div>
    </div>
  );
}
