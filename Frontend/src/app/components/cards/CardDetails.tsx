import { Calendar, CreditCard, Info } from "lucide-react";

interface CardDetailsProps {
  card: {
    name: string;
    limit: number;
    usedLimit: number;
    closingDay: number;
    dueDay: number;
  };
}

export function CardDetails({ card }: CardDetailsProps) {
  const availableLimit = card.limit - card.usedLimit;
  const usagePercentage = (card.usedLimit / card.limit) * 100;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="bg-card text-card-foreground rounded-3xl p-5 md:p-6 border border-border/50 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-2 mb-5 md:mb-6">
        <CreditCard className="text-[#2B5BBA]" size={20} />
        <h3 className="font-bold text-base md:text-lg">Resumo do Limite</h3>
      </div>

      <div className="space-y-5 md:space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-muted-foreground">Limite Utilizado</span>
            <span
              className={
                usagePercentage > 80 ? "text-red-500" : "text-foreground"
              }
            >
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${usagePercentage > 80 ? "bg-red-500" : "bg-[#2B5BBA]"}`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 bg-muted/30 rounded-2xl border border-border/30">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase mb-1">
              Disponível
            </p>
            <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(availableLimit)}
            </p>
          </div>
          <div className="p-3.5 sm:p-4 bg-muted/30 rounded-2xl border border-border/30">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase mb-1">
              Total
            </p>
            <p className="text-lg sm:text-xl font-bold">
              {formatCurrency(card.limit)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="text-muted-foreground shrink-0" size={16} />
            <span className="text-muted-foreground">Fechamento:</span>
            <span className="font-bold">Dia {card.closingDay}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Info className="text-muted-foreground shrink-0" size={16} />
            <span className="text-muted-foreground">Vencimento:</span>
            <span className="font-bold">Dia {card.dueDay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
