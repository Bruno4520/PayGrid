import { Plus, Minus, ArrowLeftRight, CreditCard } from "lucide-react";

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
      className="group flex flex-col items-center justify-center p-4 bg-muted/30 hover:bg-muted/50 rounded-2xl border border-border/50 hover:border-border transition-all text-center w-full h-full shadow-sm hover:shadow-md"
    >
      <div
        className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center flex-shrink-0 mb-3 transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>
      <h4 className="font-bold text-foreground text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground font-medium">{description}</p>
    </button>
  );
}

interface QuickActionsProps {
  onNewIncome: () => void;
  onNewExpense: () => void;
  onTransfer: () => void;
  onPayInvoice: () => void;
}

export function QuickActions({
  onNewIncome,
  onNewExpense,
  onTransfer,
  onPayInvoice,
}: QuickActionsProps) {
  return (
    <div className="bg-card text-card-foreground rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300 h-full flex flex-col">
      <h3 className="text-lg font-bold tracking-tight mb-6">Ações Rápidas</h3>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <QuickActionCard
          icon={
            <Plus
              className="text-emerald-600 dark:text-emerald-400"
              size={20}
            />
          }
          title="Nova Receita"
          description="Entrada de valor"
          bgColor="bg-emerald-500/10"
          onClick={onNewIncome}
        />

        <QuickActionCard
          icon={<Minus className="text-red-600 dark:text-red-400" size={20} />}
          title="Nova Despesa"
          description="Registrar gasto"
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
            <CreditCard
              className="text-purple-600 dark:text-purple-400"
              size={20}
            />
          }
          title="Pagar Fatura"
          description="Quitar cartão"
          bgColor="bg-purple-500/10"
          onClick={onPayInvoice}
        />
      </div>
    </div>
  );
}
