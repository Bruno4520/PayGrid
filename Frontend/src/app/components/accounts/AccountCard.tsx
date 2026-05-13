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
  {
    icon: LucideIcon;
    bgColor: string;
    iconBg: string;
    textColor: string;
    subText: string;
  }
> = {
  checking: {
    icon: Building2,
    bgColor:
      "bg-gradient-to-br from-[#2B5BBA] to-[#4C7FEE] text-white border-transparent",
    iconBg: "bg-white/20 text-white",
    textColor: "text-white",
    subText: "text-white/80",
  },
  savings: {
    icon: Sprout,
    bgColor: "bg-card text-card-foreground border-border/50",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    textColor: "text-foreground",
    subText: "text-muted-foreground",
  },
  wallet: {
    icon: Wallet,
    bgColor: "bg-card text-card-foreground border-border/50",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    textColor: "text-foreground",
    subText: "text-muted-foreground",
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div
      className={`${config.bgColor} rounded-3xl p-6 shadow-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center backdrop-blur-sm`}
        >
          <Icon size={24} />
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
            type === "checking"
              ? "bg-white/20 text-white backdrop-blur-sm"
              : isPrimary
                ? "bg-blue-500/10 text-[#2B5BBA] dark:text-[#5588ff]"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {badge}
        </span>
      </div>

      <div>
        <p className={`text-sm font-medium mb-1 ${config.subText}`}>{name}</p>
        <p
          className={`text-3xl font-bold tracking-tight mb-2 ${config.textColor}`}
        >
          {formatCurrency(balance)}
        </p>
        <p className={`text-xs font-medium ${config.subText}`}>{details}</p>
      </div>
    </div>
  );
}
