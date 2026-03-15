import { Calculator, Settings } from "lucide-react";

interface ParametersCardProps {
  initialValue: string;
  setInitialValue: (value: string) => void;
  monthlyContribution: string;
  setMonthlyContribution: (value: string) => void;
  period: string;
  setPeriod: (value: string) => void;
  rateType: string;
  setRateType: (value: string) => void;
  cdiPercentage: number;
  setCdiPercentage: (value: number) => void;
  considerTax: boolean;
  setConsiderTax: (value: boolean) => void;
  onCalculate: () => void;
}

export function ParametersCard({
  initialValue,
  setInitialValue,
  monthlyContribution,
  setMonthlyContribution,
  period,
  setPeriod,
  rateType,
  setRateType,
  cdiPercentage,
  setCdiPercentage,
  considerTax,
  setConsiderTax,
  onCalculate,
}: ParametersCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <Settings size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Parâmetros da Simulação
        </h3>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Inicial (R$)
            </label>
            <input
              type="text"
              value={initialValue}
              onChange={(e) =>
                setInitialValue(e.target.value.replace(/\D/g, ""))
              }
              placeholder="10.000,00"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aporte Mensal (R$)
            </label>
            <input
              type="text"
              value={monthlyContribution}
              onChange={(e) =>
                setMonthlyContribution(e.target.value.replace(/\D/g, ""))
              }
              placeholder="500,00"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prazo (meses)
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value.replace(/\D/g, ""))}
              placeholder="24"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Taxa
            </label>
            <select
              value={rateType}
              onChange={(e) => setRateType(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
            >
              <option value="cdi">CDI</option>
              <option value="selic">SELIC</option>
              <option value="ipca">IPCA</option>
              <option value="pre">Pré-fixado</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Percentual do CDI (%)
            </label>
            <span className="text-lg font-semibold text-[#2B5BBA]">
              {cdiPercentage}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="150"
            value={cdiPercentage}
            onChange={(e) => setCdiPercentage(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #2B5BBA 0%, #2B5BBA ${(cdiPercentage * 100) / 150}%, #E5E7EB ${(cdiPercentage * 100) / 150}%, #E5E7EB 100%)`,
            }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">0%</span>
            <span className="text-xs text-gray-500">150%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="considerTax"
            checked={considerTax}
            onChange={(e) => setConsiderTax(e.target.checked)}
            className="w-5 h-5 text-[#2B5BBA] bg-white border-gray-300 rounded focus:ring-[#2B5BBA] focus:ring-2"
          />
          <label htmlFor="considerTax" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                Considerar Imposto de Renda
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Aplica a tabela regressiva do IR
            </p>
          </label>
        </div>

        <button
          onClick={onCalculate}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#2B5BBA] text-white px-6 py-3 rounded-lg hover:bg-[#1e4594] transition-colors font-medium"
        >
          <Calculator size={18} />
          Simular Investimento
        </button>
      </div>
    </div>
  );
}
