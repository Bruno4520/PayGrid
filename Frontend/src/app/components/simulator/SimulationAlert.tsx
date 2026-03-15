import { AlertTriangle } from "lucide-react";

export function SimulationAlert() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={20}
          className="text-yellow-600 flex-shrink-0 mt-0.5"
        />
        <div>
          <h4 className="text-sm font-semibold text-yellow-900 mb-1">
            Importante: Esta é apenas uma simulação
          </h4>
          <p className="text-sm text-yellow-800">
            Esta simulação{" "}
            <span className="font-semibold">NÃO leva em conta</span> a variação
            que pode ocorrer nas taxas de juros ao longo do tempo, aumentando ou
            diminuindo. Os valores representados{" "}
            <span className="font-semibold">não garantem</span> rentabilidade
            futura. Consulte um especialista antes da decisão.
          </p>
        </div>
      </div>
    </div>
  );
}
