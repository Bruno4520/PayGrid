import { FileText, CheckCircle2 } from "lucide-react";

interface TaxTableCardProps {
  periodoMeses: number;
}

export function TaxTableCard({ periodoMeses }: TaxTableCardProps) {
  const dias = periodoMeses * 30;

  const taxBrackets = [
    {
      period: "Até 180 dias",
      rate: "22,5%",
      isActive: dias > 0 && dias <= 180,
    },
    {
      period: "181 a 360 dias",
      rate: "20,0%",
      isActive: dias > 180 && dias <= 360,
    },
    {
      period: "361 a 720 dias (até 2 anos)",
      rate: "17,5%",
      isActive: dias > 360 && dias <= 720,
    },
    {
      period: "Acima de 720 dias",
      rate: "15,0%",
      isActive: dias > 720 || dias === 0,
    },
  ];

  return (
    <div className="bg-card rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 transition-colors duration-300 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-5 md:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center shrink-0">
          <FileText className="text-[#2B5BBA] dark:text-[#5588ff] w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          Como funciona a Tabela do IR
        </h3>
      </div>

      <div className="space-y-2 flex-1">
        {taxBrackets.map((bracket, index) => (
          <div
            key={index}
            className={`flex items-center justify-between py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl transition-all ${
              bracket.isActive
                ? "bg-[#2B5BBA]/10 border border-[#2B5BBA]/30 scale-[1.02]"
                : "border border-transparent hover:bg-muted/50 opacity-60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-xs sm:text-sm font-medium ${bracket.isActive ? "text-[#2B5BBA] dark:text-[#5588ff] font-bold" : "text-muted-foreground"}`}
              >
                {bracket.period}
              </span>
              {bracket.isActive && (
                <CheckCircle2 className="text-[#2B5BBA] dark:text-[#5588ff] w-4 h-4" />
              )}
            </div>
            <span
              className={`text-lg sm:text-xl font-bold ${bracket.isActive ? "text-[#2B5BBA] dark:text-[#5588ff]" : "text-foreground"}`}
            >
              {bracket.rate}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-4">
        A linha destacada indica a alíquota aplicável ao final do seu prazo
        simulado.
      </p>
    </div>
  );
}
