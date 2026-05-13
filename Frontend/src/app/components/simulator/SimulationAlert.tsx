import { AlertTriangle } from "lucide-react";

export function SimulationAlert() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-6 transition-colors">
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={20}
          className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5"
        />
        <div>
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-1">
            Importante: Esta é apenas uma simulação
          </h4>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200/90 leading-relaxed">
            Esta simulação <span className="font-bold">NÃO leva em conta</span>{" "}
            a variação que pode ocorrer nas taxas de juros ao longo do tempo,
            aumentando ou diminuindo. Os valores representados{" "}
            <span className="font-bold">não garantem</span> rentabilidade
            futura. Consulte um especialista antes da decisão.
          </p>
        </div>
      </div>
    </div>
  );
}
