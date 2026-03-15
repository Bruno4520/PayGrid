import { TrendingUp } from "lucide-react";

export function ReferenceRatesCard() {
  const rates = [
    { label: "CDI Atual", value: "13,65% a.a." },
    { label: "SELIC Atual", value: "13,75% a.a." },
    { label: "IPCA (12 meses)", value: "4,62%" },
    { label: "Última atualização: Dezembro/2026", value: "" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <TrendingUp size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Taxas de Referência
        </h3>
      </div>

      <div className="space-y-3">
        {rates.map((rate, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{rate.label}</span>
            {rate.value && (
              <span className="text-sm font-semibold text-gray-900">
                {rate.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
