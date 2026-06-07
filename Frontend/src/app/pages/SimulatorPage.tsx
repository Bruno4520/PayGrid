import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { SimulationAlert } from "../components/simulator/SimulationAlert";
import { ParametersCard } from "../components/simulator/ParametersCard";
import { QuickTipsCard } from "../components/simulator/QuickTipsCard";
import { ReferenceRatesCard } from "../components/simulator/ReferenceRatesCard";
import { ResultsCard } from "../components/simulator/ResultsCard";
import { TaxTableCard } from "../components/simulator/TaxTableCard";
import { TermsCard } from "../components/simulator/TermsCard";
import { api } from "../../services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";

interface ChartDataPoint {
  mesNum: number;
  mesLabel: string;
  investido: number;
  total: number;
}

interface SimulationResults {
  totalInvested: number;
  finalValue: number;
  netValue: number;
  grossReturn: number;
  returnPercentage: number;
  taxPaid: number;
  netReturn: number;
}

export function SimulatorPage() {
  const [initialValue, setInitialValue] = useState("1.000,00");
  const [monthlyContribution, setMonthlyContribution] = useState("500,00");
  const [period, setPeriod] = useState("60");
  const [rateType, setRateType] = useState("cdi");
  const [cdiPercentage, setCdiPercentage] = useState(100);
  const [customRate, setCustomRate] = useState("12,00");
  const [considerTax, setConsiderTax] = useState(true);

  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [results, setResults] = useState<SimulationResults>({
    totalInvested: 0,
    finalValue: 0,
    netValue: 0,
    grossReturn: 0,
    returnPercentage: 0,
    taxPaid: 0,
    netReturn: 0,
  });

  const calculateInvestment = async () => {
    setIsSimulating(true);

    const initial = Number(initialValue.replace(/\./g, "").replace(",", "."));
    const monthly = Number(
      monthlyContribution.replace(/\./g, "").replace(",", "."),
    );
    const months = parseInt(period) || 0;

    let taxaAno = 10.0;
    if (rateType === "cdi") {
      taxaAno = 10.4 * (cdiPercentage / 100);
    } else if (rateType === "selic") {
      taxaAno = 10.5;
    } else if (rateType === "ipca") {
      taxaAno = 4.5 + 5.0;
    } else if (rateType === "pre") {
      taxaAno = Number(customRate.replace(/\./g, "").replace(",", "."));
    }

    try {
      const res = await api.post("/simulacoes", {
        nome: `Simulação (${rateType.toUpperCase()}) - ${months} meses`,
        valorInicial: initial,
        aporteMensal: monthly,
        taxa: taxaAno,
        unidadeTaxa: "aa",
        periodo: months,
        unidadePeriodo: "meses",
      });

      const data = res.data;

      setResults({
        totalInvested: data.totalInvestido,
        finalValue: data.valorFinalBruto,
        netValue: considerTax ? data.valorFinalLiquido : data.valorFinalBruto,
        grossReturn: data.valorFinalBruto - data.totalInvestido,
        returnPercentage: (data.ganhoLiquido / data.totalInvestido) * 100,
        taxPaid: considerTax ? data.valorImposto : 0,
        netReturn: considerTax
          ? data.ganhoLiquido
          : data.valorFinalBruto - data.totalInvestido,
      });

      const taxaMes = Math.pow(1 + taxaAno / 100, 1 / 12) - 1;
      const arrayEvolucao: ChartDataPoint[] = [];
      let saldoAtual = initial;
      let investidoAtual = initial;

      for (let i = 0; i <= months; i++) {
        if (i > 0) {
          saldoAtual = saldoAtual * (1 + taxaMes) + monthly;
          investidoAtual += monthly;
        }

        if (months <= 36 || i % Math.ceil(months / 24) === 0 || i === months) {
          arrayEvolucao.push({
            mesNum: i,
            mesLabel: `Mês ${i}`,
            investido: investidoAtual,
            total: saldoAtual,
          });
        }
      }

      setChartData(arrayEvolucao);
      setShowResults(true);

      setTimeout(() => {
        window.scrollTo({ top: 600, behavior: "smooth" });
      }, 100);
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Ocorreu um erro ao gerar a simulação. Verifique os dados inseridos.";
      toast.error(message);
    } finally {
      setIsSimulating(false);
    }
  };

  const CustomChartTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length >= 2) {
      const total = payload[0].value || 0;
      const investido = payload[1].value || 0;
      const juros = total - investido;

      const formatCurrency = (val: number) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(val);

      return (
        <div className="bg-card/95 backdrop-blur-sm text-card-foreground border border-border/50 p-4 rounded-2xl shadow-xl min-w-[240px]">
          <p className="font-bold text-base mb-3 pb-2 border-b border-border/50">
            {label}
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-6">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10B981]" /> Saldo
                Total
              </span>
              <span className="text-sm font-bold text-foreground">
                {formatCurrency(total)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2B5BBA]" /> Dinheiro
                Investido
              </span>
              <span className="text-sm font-bold text-foreground">
                {formatCurrency(investido)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-6 pt-3 border-t border-border/50">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Juros Ganhos
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(juros)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Simulador de Investimentos
            </h1>
            <p className="text-muted-foreground font-medium">
              Projete os seus investimentos e visualize o efeito dos juros
              compostos
            </p>
          </div>

          <div className="mb-6">
            <SimulationAlert />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 h-full">
              <ParametersCard
                initialValue={initialValue}
                setInitialValue={setInitialValue}
                monthlyContribution={monthlyContribution}
                setMonthlyContribution={setMonthlyContribution}
                period={period}
                setPeriod={setPeriod}
                rateType={rateType}
                setRateType={setRateType}
                cdiPercentage={cdiPercentage}
                setCdiPercentage={setCdiPercentage}
                customRate={customRate}
                setCustomRate={setCustomRate}
                considerTax={considerTax}
                setConsiderTax={setConsiderTax}
                onCalculate={calculateInvestment}
                isSimulating={isSimulating}
              />
            </div>
            <div className="space-y-6 h-full flex flex-col justify-between">
              <QuickTipsCard />
              <ReferenceRatesCard />
            </div>
          </div>

          <div
            className={`transition-all duration-700 ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 hidden"}`}
          >
            <div className="mb-6">
              <ResultsCard {...results} showResults={showResults} />
            </div>

            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 mb-8">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Evolução do Patrimônio
              </h3>
              <p className="text-sm font-medium text-muted-foreground mb-8">
                Acompanhe o crescimento do seu dinheiro ao longo dos meses
              </p>

              <ResponsiveContainer width="100%" height={380}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorInvestido"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2B5BBA" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2B5BBA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="mesLabel"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                    dx={-10}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Saldo Total"
                    stroke="#10B981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                  <Area
                    type="monotone"
                    dataKey="investido"
                    name="Total Investido"
                    stroke="#2B5BBA"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorInvestido)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="h-full">
              <TaxTableCard periodoMeses={parseInt(period) || 0} />
            </div>
            <div className="h-full">
              <TermsCard />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
