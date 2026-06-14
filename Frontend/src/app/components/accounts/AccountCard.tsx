import {
  Building2,
  Sprout,
  Wallet,
  Edit2,
  Trash2,
  Loader2,
  type LucideIcon,
} from "lucide-react";

interface AccountCardProps {
  id: string;
  type: "checking" | "savings" | "wallet";
  name: string;
  balance: number;
  badge: string;
  details: string;
  isDeleting?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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
    bgColor:
      "bg-gradient-to-br from-emerald-600 to-teal-500 text-white border-transparent",
    iconBg: "bg-white/20 text-white",
    textColor: "text-white",
    subText: "text-white/80",
  },
  wallet: {
    icon: Wallet,
    bgColor:
      "bg-gradient-to-br from-purple-600 to-indigo-500 text-white border-transparent",
    iconBg: "bg-white/20 text-white",
    textColor: "text-white",
    subText: "text-white/80",
  },
};

export function AccountCard({
  id,
  type,
  name,
  balance,
  badge,
  details,
  isDeleting,
  onEdit,
  onDelete,
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
      className={`${config.bgColor} rounded-3xl p-6 shadow-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-md relative group ${isDeleting ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center backdrop-blur-sm`}
        >
          <Icon size={24} />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              disabled={isDeleting}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Editar"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              disabled={isDeleting}
              className="p-1.5 hover:bg-white/20 hover:text-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Excluir"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-white/20 text-white backdrop-blur-sm ml-2">
            {badge}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <p
          className={`text-sm font-medium mb-1 truncate ${config.subText}`}
          title={name}
        >
          {name}
        </p>
        <p
          className={`text-3xl font-bold tracking-tight mb-2 truncate ${config.textColor}`}
          title={formatCurrency(balance)}
        >
          {formatCurrency(balance)}
        </p>
        <p
          className={`text-xs font-medium truncate ${config.subText}`}
          title={details}
        >
          {details}
        </p>
      </div>
    </div>
  );
}
