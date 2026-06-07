import {
  Home,
  Utensils,
  Car,
  HeartPulse,
  Gamepad2,
  ShoppingCart,
  MoreHorizontal,
  Zap,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

interface BudgetCategoryCardProps {
  categoryId: string;
  category: string;
  icon: string;
  color: string;
  planned?: number;
  spent?: number;
  isSystemCategory?: boolean;
  onSetBudget: () => void;
  onEditCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  food: Utensils,
  car: Car,
  health: HeartPulse,
  game: Gamepad2,
  entertainment: Gamepad2,
  shopping: ShoppingCart,
  energy: Zap,
  education: GraduationCap,
  other: MoreHorizontal,
};

const colorStyles: Record<string, { bg: string; text: string }> = {
  "bg-blue-500": {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
  },
  "bg-emerald-500": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  "bg-purple-500": {
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
  },
  "bg-red-500": {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
  },
  "bg-orange-500": {
    bg: "bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
  },
  "bg-yellow-500": {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600 dark:text-yellow-400",
  },
  "bg-pink-500": {
    bg: "bg-pink-500/10",
    text: "text-pink-600 dark:text-pink-400",
  },
  "bg-zinc-500": {
    bg: "bg-zinc-500/10",
    text: "text-zinc-600 dark:text-zinc-400",
  },
};

export function BudgetCategoryCard({
  categoryId,
  category,
  icon,
  color,
  planned = 0,
  spent = 0,
  isSystemCategory = false,
  onSetBudget,
  onEditCategory,
  onDeleteCategory,
}: BudgetCategoryCardProps) {
  const Icon = iconMap[icon] || MoreHorizontal;
  const style = colorStyles[color] || colorStyles["bg-blue-500"];
  const hasBudget = planned > 0;
  const percentage = hasBudget ? (spent / planned) * 100 : 0;
  const isExceeded = percentage > 100;
  const isWarning = percentage >= 85 && percentage <= 100;

  let barColor = "bg-[#2B5BBA]";
  let spentTextColor = "text-foreground";

  if (isExceeded) {
    barColor = "bg-red-500";
    spentTextColor = "text-red-600 dark:text-red-400";
  } else if (isWarning) {
    barColor = "bg-amber-500";
    spentTextColor = "text-amber-600 dark:text-amber-400";
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 group flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${style.bg}`}
          >
            <Icon className={style.text} size={24} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg tracking-tight">
              {category}
            </h3>
            {isSystemCategory && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Sistema
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditCategory(categoryId)}
            className="p-2 text-muted-foreground hover:text-[#2B5BBA] hover:bg-blue-500/10 rounded-xl transition-colors"
            title="Editar Categoria / Orçamento"
          >
            <Edit2 size={16} />
          </button>
          {!isSystemCategory && (
            <button
              onClick={() => onDeleteCategory(categoryId)}
              className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors"
              title="Excluir Categoria"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1" />

      {hasBudget ? (
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-sm font-medium text-muted-foreground block mb-1">
                Gasto Atual
              </span>
              <span
                className={`text-2xl font-bold tracking-tight ${spentTextColor} flex items-center gap-2`}
              >
                {formatCurrency(spent)}
                {isWarning && !isExceeded && (
                  <AlertTriangle
                    size={18}
                    className="text-amber-500"
                    aria-label="Atenção: Perto do limite!"
                  />
                )}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-muted-foreground block mb-1">
                Limite
              </span>
              <span className="font-bold text-foreground">
                {formatCurrency(planned)}
              </span>
            </div>
          </div>

          <div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <p className="text-[11px] font-bold text-muted-foreground text-right uppercase tracking-tighter">
              {isExceeded
                ? "Limite Excedido"
                : `${Math.round(percentage)}% utilizado`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2 mt-4">
          <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
            Você ainda não definiu um limite de gastos para esta categoria no
            mês atual.
          </p>
          <button
            onClick={onSetBudget}
            className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl bg-muted text-foreground text-sm font-bold hover:bg-[#2B5BBA] hover:text-white transition-all"
          >
            <Plus size={18} /> Definir Orçamento
          </button>
        </div>
      )}
    </div>
  );
}
