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

// CDI anual de referência: 13.65% a.a. = 1.0738% a.m.
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

  const parseNumber = (value: string): number => {
    return parseFloat(value) || 0;
  };

  const getTaxRate = (months: number): number => {
    if (months <= 6) return 0.225; // até 180 dias
    if (months <= 12) return 0.2; // 181 a 360 dias
    if (months <= 24) return 0.175; // 361 a 720 dias
    return 0.15; // acima de 720 dias
  };

  const calculateInvestment = () => {
    const initial = parseNumber(initialValue);
    const monthly = parseNumber(monthlyContribution);
    const months = parseInt(period) || 0;

    // Taxa mensal baseada no percentual do CDI
    const monthlyRate = (CDI_MONTHLY_RATE * cdiPercentage) / 100 / 100;

    let balance = initial;

    // Cálculo com juros compostos
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }

    const totalInvested = initial + monthly * months;
    const finalValue = balance;
    const grossReturn = finalValue - totalInvested;

    // Cálculo do IR
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Simulador de Investimentos
            </h1>
            <p className="text-gray-600">
              Projete seus investimentos e visualize resultados estimados
            </p>
          </div>

          {/* Alert */}
          <div className="mb-6">
            <SimulationAlert />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Parameters */}
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

            {/* Right Column - Tips and Rates */}
            <div className="space-y-6 h-full flex flex-col justify-between">
              <QuickTipsCard />
              <ReferenceRatesCard />
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <ResultsCard
              totalInvested={results.totalInvested}
              finalValue={results.finalValue}
              netValue={results.netValue}
              grossReturn={results.grossReturn}
              returnPercentage={results.returnPercentage}
              taxPaid={results.taxPaid}
              netReturn={results.netReturn}
              showResults={showResults}
            />
          </div>

          {/* Additional Info */}
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
