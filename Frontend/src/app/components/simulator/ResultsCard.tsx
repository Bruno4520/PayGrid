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
      <div className="bg-card rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 transition-colors">
        <div className="flex items-center gap-3 mb-5 md:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B5BBA]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            Resultados da Simulação
          </h3>
        </div>
        <div className="flex items-center justify-center h-40 sm:h-48 border-2 border-dashed border-border/50 rounded-2xl p-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            Preencha os parâmetros e clique em "Simular Investimento"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 transition-colors">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B5BBA]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            Resultados da Simulação
          </h3>
        </div>
        <button className="p-2 sm:p-2.5 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground shrink-0">
          <Download size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 md:mb-6">
        <div className="bg-blue-500/10 rounded-2xl p-4 sm:p-5 border border-blue-500/20">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <DollarSign size={14} className="text-blue-600 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold text-blue-700 uppercase">
              Base
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-medium text-blue-800 mb-0.5 sm:mb-1 truncate">
            Total Investido
          </p>
          <p
            className="text-base sm:text-xl font-bold text-blue-700 truncate"
            title={formatCurrency(totalInvested)}
          >
            {formatCurrency(totalInvested)}
          </p>
        </div>

        <div className="bg-teal-500/10 rounded-2xl p-4 sm:p-5 border border-teal-500/20">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <TrendingUp size={14} className="text-teal-600 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold text-teal-700 uppercase">
              Bruto
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-medium text-teal-800 mb-0.5 sm:mb-1 truncate">
            Valor Final Bruto
          </p>
          <p
            className="text-base sm:text-xl font-bold text-teal-700 truncate"
            title={formatCurrency(finalValue)}
          >
            {formatCurrency(finalValue)}
          </p>
        </div>

        <div className="bg-emerald-500/10 rounded-2xl p-4 sm:p-5 border border-emerald-500/20">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <PiggyBank size={14} className="text-emerald-600 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase">
              Líquido
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-medium text-emerald-800 mb-0.5 sm:mb-1 truncate">
            Valor Final Líquido
          </p>
          <p
            className="text-base sm:text-xl font-bold text-emerald-700 truncate"
            title={formatCurrency(netValue)}
          >
            {formatCurrency(netValue)}
          </p>
        </div>

        <div className="bg-red-500/10 rounded-2xl p-4 sm:p-5 border border-red-500/20">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <Receipt size={14} className="text-red-600 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold text-red-700 uppercase">
              IR
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-medium text-red-800 mb-0.5 sm:mb-1 truncate">
            Imposto Estimado
          </p>
          <p
            className="text-base sm:text-xl font-bold text-red-700 truncate"
            title={formatCurrency(taxPaid)}
          >
            {formatCurrency(taxPaid)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Percent className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 truncate">
              Rentabilidade Total
            </p>
            <p className="text-base sm:text-lg font-bold text-foreground truncate">
              +{returnPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 truncate">
              Rendimento Bruto
            </p>
            <p
              className="text-base sm:text-lg font-bold text-emerald-600 truncate"
              title={formatCurrency(grossReturn)}
            >
              {formatCurrency(grossReturn)}
            </p>
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 truncate">
              Rendimento Líquido
            </p>
            <p
              className="text-base sm:text-lg font-bold text-emerald-600 truncate"
              title={formatCurrency(netReturn)}
            >
              {formatCurrency(netReturn)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
