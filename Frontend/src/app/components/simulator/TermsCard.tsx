import { BookOpen } from "lucide-react";

export function TermsCard() {
  const terms = [
    {
      title: "CDI (Certificado de Depósito Interbancário)",
      description:
        "Taxa de juros que os bancos usam para emprestar dinheiro entre si. É a principal referência de rentabilidade para investimentos de renda fixa.",
    },
    {
      title: "SELIC",
      description:
        "Taxa básica de juros da economia brasileira, definida pelo Banco Central para controlar a inflação.",
    },
    {
      title: "Percentual do CDI",
      description:
        "Investimentos como CDBs frequentemente oferecem rendimentos atrelados ao CDI (ex: 110% do CDI). Significa que pagam a taxa do CDI mais um prêmio extra.",
    },
    {
      title: "Juros Compostos",
      description:
        "O famoso 'juros sobre juros'. O rendimento gerado num mês é somado ao valor principal, fazendo com que o crescimento do seu dinheiro acelere exponencialmente ao longo do tempo.",
    },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center">
          <BookOpen size={24} className="text-[#2B5BBA] dark:text-[#5588ff]" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Entenda os Termos</h3>
      </div>

      <div className="space-y-4 flex-1">
        {terms.map((term, index) => (
          <div
            key={index}
            className="pb-4 border-b border-border/50 last:border-0 last:pb-0"
          >
            <h4 className="text-sm font-bold text-foreground mb-1">
              {term.title}
            </h4>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {term.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
