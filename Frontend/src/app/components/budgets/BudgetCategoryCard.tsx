import {
  Home,
  Utensils,
  Car,
  Heart,
  Gamepad2,
  ShoppingBag,
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
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
  health: Heart,
  game: Gamepad2,
  shopping: ShoppingBag,
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
  "bg-red-500": { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
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
  planned,
  spent,
  isSystemCategory,
  onSetBudget,
  onEditCategory,
  onDeleteCategory,
}: BudgetCategoryCardProps) {
  const Icon = iconMap[icon] || iconMap.other;
  const safeColor = colorStyles[color] || colorStyles["bg-zinc-500"];
  const hasBudget = planned !== undefined && spent !== undefined;
  const percentage = hasBudget ? (spent / planned) * 100 : 0;
  const isExceeded = hasBudget && spent > planned;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-all duration-300 hover:shadow-md group relative">
      {/* AÇÕES DA CATEGORIA */}
      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEditCategory(categoryId)}
          className="p-1.5 text-muted-foreground hover:text-[#2B5BBA] hover:bg-blue-500/10 rounded-lg transition-colors"
          title="Editar Categoria"
        >
          <Edit2 size={16} />
        </button>
        {!isSystemCategory && (
          <button
            onClick={() => onDeleteCategory(categoryId)}
            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Excluir Categoria"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6 pr-12">
        {/* Aqui aplicamos as cores de fundo translúcido (bg) e o ícone com a cor (text) */}
        <div
          className={`w-12 h-12 ${safeColor.bg} rounded-xl flex items-center justify-center`}
        >
          <Icon size={24} className={safeColor.text} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {category}
          </h3>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {hasBudget
              ? isExceeded
                ? "⚠️ Excedido"
                : "✓ No Limite"
              : "Sem orçamento"}
          </p>
        </div>
      </div>

      {hasBudget ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground font-medium">Gasto</span>
              <span
                className={`font-bold ${isExceeded ? "text-red-500" : "text-foreground"}`}
              >
                {formatCurrency(spent)}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-muted-foreground font-medium">Limite</span>
              <span className="font-bold text-foreground">
                {formatCurrency(planned)}
              </span>
            </div>
          </div>

          <div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-700 ${isExceeded ? "bg-red-500" : "bg-[#2B5BBA]"}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <p className="text-[11px] font-bold text-muted-foreground text-right uppercase tracking-tighter">
              {Math.round(percentage)}% utilizado
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2">
          <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
            Você ainda não definiu um limite de gastos para esta categoria.
          </p>
          <button
            onClick={onSetBudget}
            className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl bg-muted text-foreground text-sm font-bold hover:bg-[#2B5BBA] hover:text-white transition-all group-hover:bg-opacity-100"
          >
            <Plus size={16} />
            Definir Limite
          </button>
        </div>
      )}
    </div>
  );
}
