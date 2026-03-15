import { FileText } from "lucide-react";

interface RecentTransactionsProps {
  onAddTransaction: () => void;
  onViewAll: () => void;
}

export function RecentTransactions({
  onAddTransaction,
  onViewAll,
}: RecentTransactionsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Transações Recentes
        </h3>
        <button
          onClick={onViewAll}
          className="text-sm text-[#2B5BBA] hover:text-[#1e4594] transition-colors"
        >
          Ver todas
        </button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
          <FileText className="text-gray-400" size={32} />
        </div>
        <h4 className="text-gray-900 font-medium mb-2">
          Nenhuma transação ainda
        </h4>
        <p className="text-sm text-gray-600 text-center mb-6 max-w-xs">
          Adicione sua primeira transação para começar a acompanhar suas
          finanças.
        </p>
      </div>
    </div>
  );
}
