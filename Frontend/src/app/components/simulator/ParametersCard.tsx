import { Calculator, Settings, Loader2 } from "lucide-react";

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
  customRate: string;
  setCustomRate: (value: string) => void;
  considerTax: boolean;
  setConsiderTax: (value: boolean) => void;
  onCalculate: () => void;
  isSimulating: boolean;
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
  customRate,
  setCustomRate,
  considerTax,
  setConsiderTax,
  onCalculate,
  isSimulating,
}: ParametersCardProps) {
  const formatCurrency = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const amount = Number(digits) / 100;
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleCustomRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9,]/g, "");
    setCustomRate(value);
  };

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center">
          <Settings size={24} className="text-[#2B5BBA] dark:text-[#5588ff]" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Parâmetros da Simulação
        </h3>
      </div>

      <div className="space-y-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Valor Inicial (R$)
            </label>
            <input
              type="text"
              value={initialValue}
              onChange={(e) => setInitialValue(formatCurrency(e.target.value))}
              placeholder="0,00"
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-bold"
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
                setMonthlyContribution(formatCurrency(e.target.value))
              }
              placeholder="0,00"
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-bold"
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
              placeholder="Ex: 36"
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tipo de Taxa
            </label>
            <select
              value={rateType}
              onChange={(e) => setRateType(e.target.value)}
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-bold"
            >
              <option value="cdi">CDI (Pós-fixado)</option>
              <option value="selic">SELIC</option>
              <option value="ipca">IPCA (Inflação)</option>
              <option value="pre">Pré-fixado (Manual)</option>
            </select>
          </div>
        </div>

        <div className="min-h-[80px]">
          {rateType === "cdi" ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-foreground">
                  Rendimento (% do CDI)
                </label>
                <span className="text-lg font-bold text-[#2B5BBA] dark:text-[#5588ff]">
                  {cdiPercentage}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={cdiPercentage}
                onChange={(e) => setCdiPercentage(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #2B5BBA 0%, #2B5BBA ${((cdiPercentage - 50) * 100) / 100}%, var(--muted) ${((cdiPercentage - 50) * 100) / 100}%, var(--muted) 100%)`,
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-medium text-muted-foreground">
                  50%
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  150%
                </span>
              </div>
            </div>
          ) : rateType === "pre" ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-foreground mb-2">
                Taxa Anual Esperada (%)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customRate}
                  onChange={handleCustomRateChange}
                  placeholder="10,00"
                  className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                  % a.a.
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full p-4 bg-muted/30 border border-border/50 rounded-2xl flex items-center justify-center animate-in fade-in duration-300">
              <p className="text-sm font-medium text-muted-foreground text-center">
                A simulação usará a taxa {rateType.toUpperCase()} atual de
                mercado.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border/50 rounded-2xl">
          <input
            type="checkbox"
            id="considerTax"
            checked={considerTax}
            onChange={(e) => setConsiderTax(e.target.checked)}
            className="w-5 h-5 accent-[#2B5BBA] cursor-pointer rounded"
          />
          <label htmlFor="considerTax" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                Descontar Imposto de Renda
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Aplica a tabela regressiva padrão (15% a 22,5%)
            </p>
          </label>
        </div>
      </div>

      <button
        onClick={onCalculate}
        disabled={isSimulating || !period}
        className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-[#2B5BBA] text-white px-6 py-4 rounded-xl hover:opacity-90 transition-all font-bold text-lg shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSimulating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Calculator size={20} />
            Simular Investimento
          </>
        )}
      </button>
    </div>
  );
}
