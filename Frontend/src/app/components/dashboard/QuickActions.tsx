import { Plus, Minus, ArrowLeftRight, PieChart } from "lucide-react";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  onClick: () => void;
}

function QuickActionCard({
  icon,
  title,
  description,
  bgColor,
  onClick,
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left w-full"
    >
      <div
        className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );
}

interface QuickActionsProps {
  onNewIncome: () => void;
  onNewExpense: () => void;
  onTransfer: () => void;
  onCreateBudget: () => void;
}

export function QuickActions({
  onNewIncome,
  onNewExpense,
  onTransfer,
  onCreateBudget,
}: QuickActionsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ações Rápidas
      </h3>

      <div className="space-y-3">
        <QuickActionCard
          icon={<Plus className="text-green-600" size={20} />}
          title="Nova Receita"
          description="Adicionar entrada de dinheiro"
          bgColor="bg-green-50"
          onClick={onNewIncome}
        />

        <QuickActionCard
          icon={<Minus className="text-red-600" size={20} />}
          title="Nova Despesa"
          description="Registrar um gasto"
          bgColor="bg-red-50"
          onClick={onNewExpense}
        />

        <QuickActionCard
          icon={<ArrowLeftRight className="text-blue-600" size={20} />}
          title="Transferência"
          description="Entre contas"
          bgColor="bg-blue-50"
          onClick={onTransfer}
        />

        <QuickActionCard
          icon={<PieChart className="text-purple-600" size={20} />}
          title="Criar Orçamento"
          description="Definir limites de gastos"
          bgColor="bg-purple-50"
          onClick={onCreateBudget}
        />
      </div>
    </div>
  );
}
