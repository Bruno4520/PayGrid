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
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center">
          <Settings size={24} className="text-[#2B5BBA] dark:text-[#5588ff]" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Parâmetros da Simulação
        </h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Valor Inicial (R$)
            </label>
            <input
              type="text"
              value={initialValue}
              onChange={(e) =>
                setInitialValue(e.target.value.replace(/\D/g, ""))
              }
              placeholder="10.000,00"
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Aporte Mensal (R$)
            </label>
            <input
              type="text"
              value={monthlyContribution}
              onChange={(e) =>
                setMonthlyContribution(e.target.value.replace(/\D/g, ""))
              }
              placeholder="500,00"
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Prazo (meses)
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value.replace(/\D/g, ""))}
              placeholder="24"
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tipo de Taxa
            </label>
            <select
              value={rateType}
              onChange={(e) => setRateType(e.target.value)}
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
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
            <label className="block text-sm font-medium text-foreground">
              Percentual do CDI (%)
            </label>
            <span className="text-lg font-bold text-[#2B5BBA] dark:text-[#5588ff]">
              {cdiPercentage}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="150"
            value={cdiPercentage}
            onChange={(e) => setCdiPercentage(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2B5BBA 0%, #2B5BBA ${(cdiPercentage * 100) / 150}%, var(--muted) ${(cdiPercentage * 100) / 150}%, var(--muted) 100%)`,
            }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-medium text-muted-foreground">
              0%
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              150%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border/50 rounded-2xl">
          <input
            type="checkbox"
            id="considerTax"
            checked={considerTax}
            onChange={(e) => setConsiderTax(e.target.checked)}
            className="w-5 h-5 accent-[#2B5BBA] cursor-pointer"
          />
          <label htmlFor="considerTax" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-muted-foreground" />
              <span className="text-sm font-bold text-foreground">
                Considerar Imposto de Renda
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Aplica a tabela regressiva do IR
            </p>
          </label>
        </div>

        <button
          onClick={onCalculate}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#2B5BBA] text-white px-6 py-4 rounded-xl hover:opacity-90 transition-opacity font-bold text-lg shadow-lg shadow-blue-500/20"
        >
          <Calculator size={20} /> Simular Investimento
        </button>
      </div>
    </div>
  );
}
