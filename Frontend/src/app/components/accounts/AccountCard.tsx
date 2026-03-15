import { Building2, Sprout, Wallet, type LucideIcon } from "lucide-react";

interface AccountCardProps {
  type: "checking" | "savings" | "wallet";
  name: string;
  balance: number;
  badge: string;
  details: string;
  isPrimary?: boolean;
}

const typeConfig: Record<
  string,
  { icon: LucideIcon; bgColor: string; iconBg: string }
> = {
  checking: {
    icon: Building2,
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconBg: "bg-blue-400/30",
  },
  savings: {
    icon: Sprout,
    bgColor: "bg-white",
    iconBg: "bg-green-50",
  },
  wallet: {
    icon: Wallet,
    bgColor: "bg-white",
    iconBg: "bg-purple-50",
  },
};

export function AccountCard({
  type,
  name,
  balance,
  badge,
  details,
  isPrimary,
}: AccountCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const isWhiteBg = type !== "checking";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div
      className={`${config.bgColor} rounded-2xl p-6 shadow-sm border ${
        isWhiteBg ? "border-gray-100" : "border-blue-600"
      } transition-transform hover:scale-105`}
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center`}
        >
          <Icon
            size={24}
            className={
              type === "checking"
                ? "text-white"
                : type === "savings"
                  ? "text-green-600"
                  : "text-purple-600"
            }
          />
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isPrimary
              ? "bg-blue-400/30 text-white"
              : isWhiteBg
                ? "bg-gray-100 text-gray-700"
                : "bg-blue-400/30 text-white"
          }`}
        >
          {badge}
        </span>
      </div>

      <div>
        <p
          className={`text-sm mb-2 ${
            isWhiteBg ? "text-gray-600" : "text-blue-100"
          }`}
        >
          {name}
        </p>
        <p
          className={`text-3xl font-semibold mb-2 ${
            isWhiteBg ? "text-gray-900" : "text-white"
          }`}
        >
          {formatCurrency(balance)}
        </p>
        <p
          className={`text-xs ${isWhiteBg ? "text-gray-500" : "text-blue-200"}`}
        >
          {details}
        </p>
      </div>
    </div>
  );
}
