import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CardItemData } from "./CreditCardItem";

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void | Promise<void>;
  cardToEdit?: CardItemData | null;
}

export function NewCardModal({
  isOpen,
  onClose,
  onSave,
  cardToEdit = null,
}: NewCardModalProps) {
  const [name, setName] = useState("");
  const [limitStr, setLimitStr] = useState("");
  const [limitNum, setLimitNum] = useState(0);
  const [closingDay, setClosingDay] = useState(5);
  const [dueDay, setDueDay] = useState(12);
  const [lastDigits, setLastDigits] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "");
    const amount = parseFloat(numbers) / 100;
    setLimitStr(formatCurrency(amount));
    setLimitNum(amount);
  };

  const handleLastDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 4);
    setLastDigits(onlyNumbers);
  };

  const handleReset = () => {
    setName("");
    setLimitStr("");
    setLimitNum(0);
    setClosingDay(5);
    setDueDay(12);
    setLastDigits("");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (cardToEdit) {
        setName(cardToEdit.name);
        setLimitNum(cardToEdit.limit);
        setLimitStr(formatCurrency(cardToEdit.limit));
        setClosingDay(cardToEdit.closingDay);
        setDueDay(cardToEdit.dueDay);
        setLastDigits(cardToEdit.lastDigits);
      } else {
        handleReset();
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, cardToEdit]);

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lastDigits.length !== 4) {
      toast.warning("Os últimos dígitos devem conter exatamente 4 números.");
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          nome: name,
          limite: limitNum,
          diaFechamentoFatura: closingDay,
          diaVencimentoFatura: dueDay,
          ultimosDigitos: lastDigits,
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-2xl border border-border/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border/50 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {cardToEdit ? "Editar Cartão" : "Novo Cartão de Crédito"}
          </h2>
          <button
            onClick={handleClose}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/30 rounded-2xl border border-border/50">
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
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#2B5BBA] outline-none transition-all font-bold text-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Últimos 4 Dígitos
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground tracking-widest">
                  ••••
                </span>
                <input
                  type="text"
                  value={lastDigits}
                  onChange={handleLastDigitsChange}
                  placeholder="1234"
                  className="w-full pl-16 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#2B5BBA] outline-none transition-all font-mono tracking-widest"
                  required
                />
              </div>
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

          <div className="flex gap-4 pt-4 mt-2 border-t border-border/50">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3.5 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3.5 bg-[#2B5BBA] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-[#1e4594] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 size={18} className="animate-spin" />}
              {isSaving
                ? "Salvando..."
                : cardToEdit
                  ? "Salvar Alterações"
                  : "Criar Cartão"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
