import { useState } from "react";
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

const CDI_MONTHLY_RATE = 1.0738;

export function SimulatorPage() {
  const [initialValue, setInitialValue] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [period, setPeriod] = useState("24");
  const [rateType, setRateType] = useState("cdi");
  const [cdiPercentage, setCdiPercentage] = useState(100);
  const [considerTax, setConsiderTax] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({
    totalInvested: 0,
    finalValue: 0,
    netValue: 0,
    grossReturn: 0,
    returnPercentage: 0,
    taxPaid: 0,
    netReturn: 0,
  });

  const parseNumber = (value: string): number => parseFloat(value) || 0;

  const getTaxRate = (months: number): number => {
    if (months <= 6) return 0.225;
    if (months <= 12) return 0.2;
    if (months <= 24) return 0.175;
    return 0.15;
  };

  const calculateInvestment = () => {
    const initial = parseNumber(initialValue);
    const monthly = parseNumber(monthlyContribution);
    const months = parseInt(period) || 0;

    const monthlyRate = (CDI_MONTHLY_RATE * cdiPercentage) / 100 / 100;
    let balance = initial;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }

    const totalInvested = initial + monthly * months;
    const finalValue = balance;
    const grossReturn = finalValue - totalInvested;

    let taxPaid = 0;
    let netReturn = grossReturn;
    let netValue = finalValue;

    if (considerTax && grossReturn > 0) {
      const taxRate = getTaxRate(months);
      taxPaid = grossReturn * taxRate;
      netReturn = grossReturn - taxPaid;
      netValue = finalValue - taxPaid;
    }

    const returnPercentage =
      totalInvested > 0 ? (grossReturn / totalInvested) * 100 : 0;

    setResults({
      totalInvested,
      finalValue,
      netValue,
      grossReturn,
      returnPercentage,
      taxPaid,
      netReturn,
    });
    setShowResults(true);
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="João Silva" userRole="Administrador" />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Simulador de Investimentos
            </h1>
            <p className="text-muted-foreground font-medium">
              Projete seus investimentos e visualize resultados estimados
            </p>
          </div>

          <div className="mb-6">
            <SimulationAlert />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
                considerTax={considerTax}
                setConsiderTax={setConsiderTax}
                onCalculate={calculateInvestment}
              />
            </div>
            <div className="space-y-6 h-full flex flex-col justify-between">
              <QuickTipsCard />
              <ReferenceRatesCard />
            </div>
          </div>

          <div className="mb-6">
            <ResultsCard {...results} showResults={showResults} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="h-full">
              <TaxTableCard />
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
