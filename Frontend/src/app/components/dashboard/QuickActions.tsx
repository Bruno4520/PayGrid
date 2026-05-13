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
      className="group flex items-center gap-4 p-4 bg-background hover:bg-muted/50 rounded-xl border border-border/50 hover:border-border transition-all text-left w-full"
    >
      <div
        className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground mb-0.5">{title}</h4>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
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
    <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border/50 transition-colors duration-300 h-full">
      <h3 className="text-lg font-bold tracking-tight mb-5">Ações Rápidas</h3>

      <div className="space-y-3">
        <QuickActionCard
          icon={
            <Plus
              className="text-emerald-600 dark:text-emerald-400"
              size={20}
            />
          }
          title="Nova Receita"
          description="Adicionar entrada de dinheiro"
          bgColor="bg-emerald-500/10"
          onClick={onNewIncome}
        />

        <QuickActionCard
          icon={<Minus className="text-red-600 dark:text-red-400" size={20} />}
          title="Nova Despesa"
          description="Registrar um gasto"
          bgColor="bg-red-500/10"
          onClick={onNewExpense}
        />

        <QuickActionCard
          icon={
            <ArrowLeftRight
              className="text-blue-600 dark:text-blue-400"
              size={20}
            />
          }
          title="Transferência"
          description="Entre contas"
          bgColor="bg-blue-500/10"
          onClick={onTransfer}
        />

        <QuickActionCard
          icon={
            <PieChart
              className="text-purple-600 dark:text-purple-400"
              size={20}
            />
          }
          title="Criar Orçamento"
          description="Definir limites de gastos"
          bgColor="bg-purple-500/10"
          onClick={onCreateBudget}
        />
      </div>
    </div>
  );
}
