import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

export function TermsCard() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const terms = [
    {
      title: "CDI (Certificado de Depósito Interbancário)",
      description:
        "Taxa de juros praticada em empréstimos entre bancos. É a principal referência de rentabilidade para a maioria dos investimentos de renda fixa no Brasil.",
    },
    {
      title: "SELIC",
      description:
        "Taxa básica de juros da economia, definida pelo Banco Central. Ela influencia todas as outras taxas do mercado e é usada como principal ferramenta para controlar a inflação.",
    },
    {
      title: "Percentual do CDI",
      description:
        "Indica quanto do CDI o investimento vai render. Por exemplo, um CDB que rende 110% do CDI paga, ao final do período, o equivalente a 1,1 vez a taxa acumulada do CDI.",
    },
    {
      title: "Juros Compostos",
      description:
        "O rendimento de cada período é calculado sobre o valor total acumulado (capital mais juros anteriores). Isso faz com que o dinheiro cresça de forma acelerada ao longo do tempo.",
    },
  ];

  const toggleTerm = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-card rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center shrink-0">
          <BookOpen className="text-[#2B5BBA] dark:text-[#5588ff] w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          Entenda os Termos
        </h3>
      </div>

      <div className="space-y-1 flex-1">
        {terms.map((term, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border-b border-border/50 last:border-0"
            >
              <button
                onClick={() => toggleTerm(index)}
                className="w-full py-3.5 sm:py-4 flex items-center justify-between text-left group focus:outline-none"
              >
                <h4
                  className={`text-xs sm:text-sm font-bold transition-colors ${
                    isOpen
                      ? "text-[#2B5BBA] dark:text-[#5588ff]"
                      : "text-foreground group-hover:text-[#2B5BBA]"
                  }`}
                >
                  {term.title}
                </h4>
                <ChevronDown
                  className={`text-muted-foreground transition-transform duration-300 shrink-0 ml-3 w-4 h-4 sm:w-[18px] sm:h-[18px] ${
                    isOpen ? "rotate-180 text-[#2B5BBA]" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed pb-3 sm:pb-4">
                    {term.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
