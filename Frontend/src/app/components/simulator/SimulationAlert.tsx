import { AlertTriangle } from "lucide-react";

export function SimulationAlert() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 sm:p-5 mb-5 md:mb-6 transition-colors">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <AlertTriangle className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5" />
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-400 mb-1">
            Importante: Esta é uma projeção estimada
          </h4>
          <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300/90 leading-relaxed">
            Esta simulação{" "}
            <span className="font-bold">assume taxas constantes</span> ao longo
            do tempo. Na realidade, indexadores como CDI, SELIC e IPCA sofrem
            variações. O cálculo do Imposto de Renda é feito de forma
            simplificada, aplicando a alíquota correspondente ao prazo total do
            investimento sobre todo o rendimento.
          </p>
        </div>
      </div>
    </div>
  );
}
