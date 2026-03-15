import { FileText, CheckCircle2 } from "lucide-react";

export function TaxTableCard() {
  const taxBrackets = [
    { period: "Até 180 dias", rate: "22,5%", isActive: false },
    { period: "181 a 360 dias", rate: "20,0%", isActive: false },
    { period: "361 a 720 dias (até 2 anos)", rate: "17,5%", isActive: true },
    { period: "Acima de 720 dias", rate: "15,0%", isActive: false },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <FileText size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Como funciona a Tabela Regressiva do IR
        </h3>
      </div>

      <div className="space-y-2">
        {taxBrackets.map((bracket, index) => (
          <div
            key={index}
            className={`flex items-center justify-between py-3 px-4 border-b border-gray-100 last:border-0 rounded-lg transition-colors ${
              bracket.isActive
                ? "bg-blue-50 border-transparent ring-1 ring-blue-200"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${
                  bracket.isActive
                    ? "text-blue-700 font-medium"
                    : "text-gray-600"
                }`}
              >
                {bracket.period}
              </span>
              {bracket.isActive && (
                <CheckCircle2 size={16} className="text-blue-600" />
              )}
            </div>

            <span
              className={`text-xl font-bold ${
                bracket.isActive ? "text-blue-700" : "text-gray-900"
              }`}
            >
              {bracket.rate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
