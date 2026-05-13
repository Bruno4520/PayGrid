import React, { useState, useEffect } from "react";
import { X, CreditCard } from "lucide-react";

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export function NewCardModal({ isOpen, onClose, onSave }: NewCardModalProps) {
  const [name, setName] = useState("");
  const [limitStr, setLimitStr] = useState("");
  const [limitNum, setLimitNum] = useState(0);
  const [closingDay, setClosingDay] = useState(5);
  const [dueDay, setDueDay] = useState(12);

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "");
    const amount = parseFloat(numbers) / 100;
    setLimitStr(
      amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
    setLimitNum(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave)
      onSave({
        name,
        limite: limitNum,
        diaFechamento: closingDay,
        diaVencimento: dueDay,
      });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-xl border border-border/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border/50 flex justify-between items-center">
          <h2 className="text-xl font-bold">Novo Cartão de Crédito</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nome do Cartão (ou Banco)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Nubank Ultravioleta"
              className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:ring-2 focus:ring-[#2B5BBA] outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Limite Total
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#2B5BBA]">
                R$
              </span>
              <input
                type="text"
                value={limitStr}
                onChange={handleLimitChange}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:ring-2 focus:ring-[#2B5BBA] outline-none transition-all font-bold text-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Dia do Fechamento
              </label>
              <select
                value={closingDay}
                onChange={(e) => setClosingDay(Number(e.target.value))}
                className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl outline-none focus:ring-2 focus:ring-[#2B5BBA]"
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Dia {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Dia do Vencimento
              </label>
              <select
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl outline-none focus:ring-2 focus:ring-[#2B5BBA]"
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Dia {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-muted rounded-xl font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-[#2B5BBA] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
            >
              Criar Cartão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
