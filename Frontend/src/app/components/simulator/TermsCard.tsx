import { BookOpen } from "lucide-react";

export function TermsCard() {
  const terms = [
    {
      title: "CDI (Certificado de Depósito Interbancário)",
      description:
        "Taxa de juros de referência para empréstimos entre bancos. É usado também como referência de rentabilidade de renda fixa.",
    },
    {
      title: "SELIC (Sistema Especial de Liquidação)",
      description:
        "Taxa básica de juros da economia Brasileira, definida pelo Banco Central.",
    },
    {
      title: "Percentual do CDI",
      description:
        "Investimentos de renda fixa normalmente pagam 100% do CDI ou percentuais igual ao CDI.",
    },
    {
      title: "Juros Compostos",
      description:
        "É um tipo de juros onde o valor acrescentado se soma ao principal, percentuais aplicados no longo prazo.",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <BookOpen size={20} className="text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Entenda os Termos
        </h3>
      </div>

      <div className="space-y-4">
        {terms.map((term, index) => (
          <div
            key={index}
            className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {term.title}
            </h4>
            <p className="text-sm text-gray-600">{term.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
