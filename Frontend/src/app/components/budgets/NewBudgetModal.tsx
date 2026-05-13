import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface NewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (budget: BudgetData) => void;
  initialCategoryId?: string;
}

export interface BudgetData {
  categoriaId: string;
  plannedAmount: number;
  mes: number;
  ano: number;
}

const categoriasMock = [
  { id: "c1", nome: "Moradia" },
  { id: "c2", nome: "Alimentação" },
  { id: "c3", nome: "Transporte" },
  { id: "c4", nome: "Saúde" },
  { id: "c5", nome: "Lazer" },
  { id: "c6", nome: "Compras" },
];

export function NewBudgetModal({
  isOpen,
  onClose,
  onSave,
  initialCategoryId = "",
}: NewBudgetModalProps) {
  const [categoriaId, setCategoriaId] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [amountNum, setAmountNum] = useState(0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [monthYear, setMonthYear] = useState(currentMonth);

  const formatCurrency = (value: string) => {
    if (!value) return { formatted: "", num: 0 };
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return { formatted: "", num: 0 };
    const amount = parseFloat(numbers) / 100;
    return {
      formatted: amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      num: amount,
    };
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formatted, num } = formatCurrency(e.target.value);
    setAmountStr(formatted);
    setAmountNum(num);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      const [anoStr, mesStr] = monthYear.split("-");
      onSave({
        categoriaId,
        plannedAmount: amountNum,
        mes: parseInt(mesStr, 10),
        ano: parseInt(anoStr, 10),
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setCategoriaId("");
    setAmountStr("");
    setAmountNum(0);
    setMonthYear(currentMonth);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialCategoryId) {
        setCategoriaId(initialCategoryId);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialCategoryId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border/50 animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-card/80 backdrop-blur-md border-b border-border/50 px-8 py-5 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl font-bold tracking-tight">Novo Orçamento</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Categoria
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl focus:ring-2 focus:ring-[#2B5BBA] outline-none transition-all"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categoriasMock.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Valor Planejado */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Valor Limite
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2B5BBA] font-bold">
                  R$
                </span>
                <input
                  type="text"
                  value={amountStr}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-transparent rounded-xl focus:ring-2 focus:ring-[#2B5BBA] outline-none transition-all font-semibold text-lg"
                  required
                />
              </div>
            </div>

            {/* Mês de Referência */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mês e Ano
              </label>
              <input
                type="month"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:ring-2 focus:ring-[#2B5BBA] outline-none transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6 border-t border-border/50 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3.5 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#2B5BBA] hover:bg-[#1e4594] transition-all shadow-lg shadow-blue-500/20"
            >
              Salvar Orçamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
