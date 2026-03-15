import { ShoppingCart, Fuel, Utensils, Music } from "lucide-react";

export interface Purchase {
  id: string;
  merchant: string;
  date: string;
  time: string;
  amount: number;
  category: string;
  icon: "shopping" | "fuel" | "food" | "music";
}

interface RecentPurchasesProps {
  purchases: Purchase[];
}

const iconMap = {
  shopping: ShoppingCart,
  fuel: Fuel,
  food: Utensils,
  music: Music,
};

const iconColorMap = {
  shopping: "bg-red-50 text-red-600",
  fuel: "bg-blue-50 text-blue-600",
  food: "bg-green-50 text-green-600",
  music: "bg-purple-50 text-purple-600",
};

export function RecentPurchases({ purchases }: RecentPurchasesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Últimas Compras
      </h3>

      <div className="space-y-4">
        {purchases.map((purchase) => {
          const Icon = iconMap[purchase.icon];
          return (
            <div
              key={purchase.id}
              className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColorMap[purchase.icon]}`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {purchase.merchant}
                  </p>
                  <p className="text-xs text-gray-500">
                    {purchase.date} às {purchase.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-red-600">
                  -{formatCurrency(purchase.amount)}
                </p>
                <p className="text-xs text-gray-500">{purchase.category}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
