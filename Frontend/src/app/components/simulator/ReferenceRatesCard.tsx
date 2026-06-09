import { TrendingUp } from "lucide-react";

export function ReferenceRatesCard() {
  const rates = [
    { label: "CDI Atual", value: "14,40% a.a." },
    { label: "SELIC Atual", value: "14,50% a.a." },
    { label: "IPCA (12 meses)", value: "4,39%" },
    { label: "Última atualização:", value: "Jun/2026" },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center">
          <TrendingUp
            size={24}
            className="text-[#2B5BBA] dark:text-[#5588ff]"
          />
        </div>
        <h3 className="text-xl font-bold text-foreground">Taxas de Mercado</h3>
      </div>

      <div className="space-y-4">
        {rates.map((rate, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {rate.label}
            </span>
            <span className="text-sm font-bold text-foreground">
              {rate.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
