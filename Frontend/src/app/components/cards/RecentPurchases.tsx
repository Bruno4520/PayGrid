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

export interface Purchase {
  id: string;
  merchant: string;
  date: string;
  time: string;
  amount: number;
  category: string;
  icon: "shopping" | "fuel" | "food" | "music" | "other";
}

interface RecentPurchasesProps {
  cardId: string;
  onNewPurchase: (cardId: string) => void;
  onEditPurchase: (purchaseId: string) => void;
  onDeletePurchase: (purchaseId: string) => void;
}

const iconMap = {
  shopping: ShoppingCart,
  fuel: Fuel,
  food: Utensils,
  music: Music,
  other: FileText,
};

const iconColorMap = {
  shopping: "bg-red-500/10 text-red-600 dark:text-red-400",
  fuel: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  food: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  music: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  other: "bg-muted text-muted-foreground",
};

export function RecentPurchases({
  cardId,
  onNewPurchase,
  onEditPurchase,
  onDeletePurchase,
}: RecentPurchasesProps) {
  const getMockPurchases = (id: string): Purchase[] => {
    if (id === "1") {
      return [
        {
          id: "p1",
          merchant: "Supermercado Extra",
          date: "10/12/2026",
          time: "14:30",
          amount: 450.8,
          category: "Alimentação",
          icon: "shopping",
        },
        {
          id: "p2",
          merchant: "Posto Shell",
          date: "08/12/2026",
          time: "09:15",
          amount: 200.0,
          category: "Transporte",
          icon: "fuel",
        },
        {
          id: "p3",
          merchant: "iFood",
          date: "05/12/2026",
          time: "20:45",
          amount: 89.9,
          category: "Alimentação",
          icon: "food",
        },
      ];
    }
    return [
      {
        id: "p4",
        merchant: "Spotify Premium",
        date: "01/12/2026",
        time: "00:00",
        amount: 21.9,
        category: "Assinaturas",
        icon: "music",
      },
      {
        id: "p5",
        merchant: "Amazon Brasil",
        date: "28/11/2026",
        time: "16:20",
        amount: 1599.0,
        category: "Eletrônicos",
        icon: "shopping",
      },
    ];
  };

  const purchases = getMockPurchases(cardId);

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
          <Plus size={16} />
          Nova Compra
        </button>
      </div>

      <div className="space-y-2">
        {purchases.map((purchase) => {
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
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {purchase.date} às {purchase.time}
                  </p>
                </div>
              </div>

              {/* Valores originais ficam opacos ao passar o mouse para mostrar as ações */}
              <div className="text-right group-hover:opacity-0 transition-opacity absolute right-4">
                <p className="text-sm font-bold tracking-tight text-foreground">
                  -{formatCurrency(purchase.amount)}
                </p>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  {purchase.category}
                </p>
              </div>

              {/* Ações (Editar/Excluir) aparecem ao passar o mouse */}
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                <button
                  onClick={() => onEditPurchase(purchase.id)}
                  className="p-2 text-muted-foreground hover:text-[#2B5BBA] hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="Editar compra"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDeletePurchase(purchase.id)}
                  className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Excluir compra"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {purchases.length === 0 && (
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
