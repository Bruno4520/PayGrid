import { CreditCard, Edit2, Trash2 } from "lucide-react";

interface CreditCardItemProps {
  label: string;
  bank: string;
  availableLimit: number;
  cardNumber: string;
  color: "purple" | "orange" | "red";
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const colorMap = {
  purple: "bg-gradient-to-br from-purple-500 to-purple-600",
  orange: "bg-gradient-to-br from-orange-500 to-orange-600",
  red: "bg-gradient-to-br from-red-500 to-red-600",
};

const ringColorMap = {
  purple: "ring-purple-100",
  orange: "ring-orange-300",
  red: "ring-red-100",
};

export function CreditCardItem({
  label,
  bank,
  availableLimit,
  cardNumber,
  color,
  isSelected,
  onClick,
  onEdit,
  onDelete,
}: CreditCardItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`relative ${colorMap[color]} text-white rounded-2xl p-6 w-full text-left transition-all hover:scale-105 cursor-pointer ${
        isSelected ? `ring-4 ${ringColorMap[color]} ring-offset-2` : ""
      }`}
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs text-blue-100 mb-1">{label}</p>
          <h3 className="text-xl font-semibold">{bank}</h3>
        </div>
        <CreditCard size={32} className="text-white opacity-80" />
      </div>

      <div>
        <p className="text-xs text-blue-100 mb-1">Limite disponível</p>
        <p className="text-2xl font-semibold mb-4">
          {formatCurrency(availableLimit)}
        </p>
        <p className="text-sm text-blue-100 tracking-wider">{cardNumber}</p>
      </div>

      {/* Botões de Ação */}
      <div className="absolute bottom-4 right-4 flex gap-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          aria-label="Editar cartão"
          title="Editar cartão"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          aria-label="Excluir cartão"
          title="Excluir cartão"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
