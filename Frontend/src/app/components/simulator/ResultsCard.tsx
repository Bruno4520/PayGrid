import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  Receipt,
  Percent,
  Download,
} from "lucide-react";

interface ResultsCardProps {
  totalInvested: number;
  finalValue: number;
  netValue: number;
  grossReturn: number;
  returnPercentage: number;
  taxPaid: number;
  netReturn: number;
  showResults: boolean;
}

export function ResultsCard({
  totalInvested,
  finalValue,
  netValue,
  grossReturn,
  returnPercentage,
  taxPaid,
  netReturn,
  showResults,
}: ResultsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  if (!showResults) {
    return (
      <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp
              size={24}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Resultados da Simulação
          </h3>
        </div>
        <div className="flex items-center justify-center h-48 border-2 border-dashed border-border/50 rounded-2xl">
          <p className="text-sm font-medium text-muted-foreground">
            Preencha os parâmetros e clique em "Simular Investimento"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp
              size={24}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Resultados da Simulação
          </h3>
        </div>
        <button className="p-2.5 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
          <Download size={20} />
        </button>
      </div>

      {/* Main Results */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500/10 rounded-2xl p-5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign
              size={16}
              className="text-blue-600 dark:text-blue-400"
            />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">
              Base
            </span>
          </div>
          <p className="text-xs font-medium text-blue-800 dark:text-blue-300/80 mb-1">
            Total Investido
          </p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
            {formatCurrency(totalInvested)}
          </p>
        </div>

        <div className="bg-teal-500/10 rounded-2xl p-5 border border-teal-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp
              size={16}
              className="text-teal-600 dark:text-teal-400"
            />
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase">
              Bruto
            </span>
          </div>
          <p className="text-xs font-medium text-teal-800 dark:text-teal-300/80 mb-1">
            Valor Final Bruto
          </p>
          <p className="text-xl font-bold text-teal-700 dark:text-teal-400">
            {formatCurrency(finalValue)}
          </p>
        </div>

        <div className="bg-emerald-500/10 rounded-2xl p-5 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank
              size={16}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">
              Líquido
            </span>
          </div>
          <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300/80 mb-1">
            Valor Final Líquido
          </p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(netValue)}
          </p>
        </div>

        <div className="bg-orange-500/10 rounded-2xl p-5 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Receipt
              size={16}
              className="text-orange-600 dark:text-orange-400"
            />
            <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase">
              IR
            </span>
          </div>
          <p className="text-xs font-medium text-orange-800 dark:text-orange-300/80 mb-1">
            Imposto Estimado
          </p>
          <p className="text-xl font-bold text-orange-700 dark:text-orange-400">
            {formatCurrency(taxPaid)}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Percent size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">
              Rentabilidade Total
            </p>
            <p className="text-lg font-bold text-foreground">
              +{returnPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp
              size={20}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">
              Lucro Bruto
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(grossReturn)}
            </p>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <PiggyBank
              size={20}
              className="text-emerald-600 dark:text-emerald-400"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5">
              Lucro Líquido
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(netReturn)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
