import { Plus } from "lucide-react";

interface CardDetailsProps {
  totalLimit: number;
  available: number;
  closingDay: number;
  dueDay: number;
  onNewPurchase: () => void;
}

export function CardDetails({
  totalLimit,
  available,
  closingDay,
  dueDay,
  onNewPurchase,
}: CardDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const used = totalLimit - available;
  const usagePercentage = (used / totalLimit) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Cartão Principal
        </h3>
        <button
          onClick={onNewPurchase}
          className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-4 py-2 rounded-lg hover:bg-[#1e4594] transition-colors text-sm"
        >
          <Plus size={16} />
          Nova Compra
        </button>
      </div>

      {/* Card Info Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Limite Total</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(totalLimit)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Disponível</p>
          <p className="text-lg font-semibold text-green-600">
            {formatCurrency(available)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Fechamento</p>
          <p className="text-lg font-semibold text-gray-900">
            Dia {closingDay}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Vencimento</p>
          <p className="text-lg font-semibold text-gray-900">Dia {dueDay}</p>
        </div>
      </div>

      {/* Usage Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-700">Uso do limite</p>
          <p className="text-sm font-medium text-gray-900">
            {usagePercentage.toFixed(0)}% utilizado
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">{formatCurrency(used)} usado</p>
          <p className="text-xs text-gray-500">
            {formatCurrency(available)} disponível
          </p>
        </div>
      </div>
    </div>
  );
}
