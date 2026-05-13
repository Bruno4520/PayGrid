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
        "É um tipo de juros onde o valor acrescentado se soma ao principal, potencializando ganhos no longo prazo.",
    },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center">
          <BookOpen size={24} className="text-[#2B5BBA] dark:text-[#5588ff]" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Entenda os Termos</h3>
      </div>

      <div className="space-y-4">
        {terms.map((term, index) => (
          <div
            key={index}
            className="pb-4 border-b border-border/50 last:border-0 last:pb-0"
          >
            <h4 className="text-sm font-bold text-foreground mb-1">
              {term.title}
            </h4>
            <p className="text-sm font-medium text-muted-foreground">
              {term.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
