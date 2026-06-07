import {
  ShoppingCart,
  Fuel,
  Utensils,
  Music,
  FileText,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import type { Transaction } from "../transactions/TransactionTable";

interface RecentPurchasesProps {
  cardId: string;
  purchases: Transaction[];
  onNewPurchase: (cardId: string) => void;
  onEditPurchase: (transaction: Transaction) => void;
  onDeletePurchase: (purchaseId: number) => void;
}

const iconMap: Record<string, any> = {
  shopping: ShoppingCart,
  fuel: Fuel,
  food: Utensils,
  music: Music,
  other: FileText,
};

const iconColorMap: Record<string, string> = {
  shopping: "bg-red-500/10 text-red-600 dark:text-red-400",
  fuel: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  food: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  music: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  other: "bg-muted text-muted-foreground",
};

export function RecentPurchases({
  cardId,
  purchases,
  onNewPurchase,
  onEditPurchase,
  onDeletePurchase,
}: RecentPurchasesProps) {
  const formattedPurchases = purchases.map((t) => {
    const dateObj = new Date(t.data);
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());

    const catName = t.categoria?.nome?.toLowerCase() || "";
    let icon = "other";
    if (
      catName.includes("alimentação") ||
      catName.includes("comida") ||
      catName.includes("restaurante")
    )
      icon = "food";
    else if (
      catName.includes("transporte") ||
      catName.includes("combustível") ||
      catName.includes("posto")
    )
      icon = "fuel";
    else if (
      catName.includes("compra") ||
      catName.includes("mercado") ||
      catName.includes("shopping")
    )
      icon = "shopping";
    else if (
      catName.includes("lazer") ||
      catName.includes("música") ||
      catName.includes("entretenimento")
    )
      icon = "music";

    return {
      id: t.id,
      rawTransaction: t,
      merchant: t.descricao,
      date: dateObj.toLocaleDateString("pt-BR"),
      time: new Date(t.data).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: t.valor,
      type: t.tipo,
      category: t.categoria?.nome || "Outros",
      icon: icon,
      parcelas: t.parcelas?.length || 1,
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-card text-card-foreground rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold tracking-tight">Últimas Compras</h3>
        <button
          onClick={() => onNewPurchase(cardId)}
          className="inline-flex items-center gap-1.5 bg-[#2B5BBA]/10 text-[#2B5BBA] dark:text-[#5588ff] px-3 py-1.5 rounded-lg hover:bg-[#2B5BBA]/20 transition-colors font-medium text-sm"
        >
          <Plus size={16} /> Nova Compra
        </button>
      </div>

      <div className="space-y-2">
        {formattedPurchases.map((purchase) => {
          const Icon = iconMap[purchase.icon] || iconMap.other;
          return (
            <div
              key={purchase.id}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/50 transition-colors group relative"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorMap[purchase.icon]}`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-0.5">
                    {purchase.merchant}
                    {purchase.parcelas > 1 && (
                      <span className="ml-2 text-xs font-bold text-[#2B5BBA]">
                        ({purchase.parcelas}x)
                      </span>
                    )}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {purchase.date} às{" "}
                    {purchase.time === "00:00" ? "12:00" : purchase.time}
                  </p>
                </div>
              </div>

              <div className="text-right group-hover:opacity-0 transition-opacity absolute right-4">
                <p
                  className={`text-sm font-bold tracking-tight ${purchase.type === "RECEITA" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {purchase.type === "RECEITA" ? "+" : "-"}{" "}
                  {formatCurrency(purchase.amount)}
                </p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  {purchase.category}
                </p>
              </div>

              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                <button
                  onClick={() => onEditPurchase(purchase.rawTransaction)}
                  className="p-2 text-muted-foreground hover:text-[#2B5BBA] hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDeletePurchase(purchase.id)}
                  className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {formattedPurchases.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Nenhuma compra recente registrada neste cartão.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
