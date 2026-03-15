import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  Receipt,
  Percent,
  Download,
  AlertTriangle,
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
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados da Simulação
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">
            Preencha os parâmetros e clique em "Simular Investimento"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Resultados da Simulação
          </h3>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Download size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Main Results */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Investido */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign size={16} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-900 uppercase">
              Base
            </span>
          </div>
          <p className="text-xs text-blue-700 mb-1">Total Investido</p>
          <p className="text-xl font-bold text-blue-900">
            {formatCurrency(totalInvested)}
          </p>
        </div>

        {/* Valor Final Bruto */}
        <div className="bg-teal-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-teal-600" />
            </div>
            <span className="text-xs font-medium text-teal-900 uppercase">
              Bruto
            </span>
          </div>
          <p className="text-xs text-teal-700 mb-1">Valor Final Bruto</p>
          <p className="text-xl font-bold text-teal-900">
            {formatCurrency(finalValue)}
          </p>
        </div>

        {/* Valor Final Líquido */}
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <PiggyBank size={16} className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-900 uppercase">
              Líquido
            </span>
          </div>
          <p className="text-xs text-green-700 mb-1">Valor Final Líquido</p>
          <p className="text-xl font-bold text-green-900">
            {formatCurrency(netValue)}
          </p>
        </div>

        {/* Imposto Estimado */}
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Receipt size={16} className="text-orange-600" />
            </div>
            <span className="text-xs font-medium text-orange-900 uppercase">
              IR
            </span>
          </div>
          <p className="text-xs text-orange-700 mb-1">Imposto Estimado</p>
          <p className="text-xl font-bold text-orange-900">
            {formatCurrency(taxPaid)}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Percent size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-blue-700 mb-0.5">Rentabilidade Total</p>
            <p className="text-lg font-bold text-blue-900">
              +{returnPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-green-700 mb-0.5">Lucro Bruto</p>
            <p className="text-lg font-bold text-green-900">
              {formatCurrency(grossReturn)}
            </p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <PiggyBank size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-green-700 mb-0.5">Lucro Líquido</p>
            <p className="text-lg font-bold text-green-900">
              {formatCurrency(netReturn)}
            </p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle
            size={16}
            className="text-yellow-600 flex-shrink-0 mt-0.5"
          />
          <p className="text-xs text-yellow-800">
            <span className="font-semibold">Aviso Importante:</span> Estes são
            resultados estimados baseados em projeções aproximadas. Não há
            garantia de rentabilidade futura. Fatores como oscilações de
            mercado, mudanças na taxa de juros podem afetar os resultados reais.
          </p>
        </div>
      </div>
    </div>
  );
}
