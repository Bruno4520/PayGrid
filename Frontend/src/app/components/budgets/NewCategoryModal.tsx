import React, { useState, useEffect } from "react";
import {
  X,
  Home,
  ShoppingCart,
  Car,
  HeartPulse,
  Utensils,
  Gamepad2,
  GraduationCap,
  Zap,
  MoreHorizontal,
  Loader2,
} from "lucide-react";

export interface CategoryInitialData {
  id?: number;
  nome: string;
  icone: string;
  cor: string;
  descricao: string;
  isSystem: boolean;
  plannedBudget: number;
}

export interface CategorySavePayload {
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
  plannedBudget: number;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: CategorySavePayload) => void | Promise<void>;
  initialData?: CategoryInitialData | null;
}

const ICONS = [
  { id: "home", component: Home },
  { id: "shopping", component: ShoppingCart },
  { id: "car", component: Car },
  { id: "health", component: HeartPulse },
  { id: "food", component: Utensils },
  { id: "entertainment", component: Gamepad2 },
  { id: "education", component: GraduationCap },
  { id: "energy", component: Zap },
  { id: "other", component: MoreHorizontal },
];

const COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-zinc-500",
];

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CategoryModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("other");
  const [selectedColor, setSelectedColor] = useState("bg-blue-500");

  const [valor, setValor] = useState("");
  const [valorNumerico, setValorNumerico] = useState(0);

  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!initialData?.id;
  const isSystem = !!initialData?.isSystem;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialData) {
        setNome(initialData.nome || "");
        setDescricao(initialData.descricao || "");
        setSelectedIcon(initialData.icone || "other");
        setSelectedColor(initialData.cor || "bg-blue-500");

        const planned = initialData.plannedBudget || 0;
        setValorNumerico(planned);
        setValor(
          planned > 0
            ? planned.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : "",
        );
      } else {
        setNome("");
        setDescricao("");
        setSelectedIcon("other");
        setSelectedColor("bg-blue-500");
        setValor("");
        setValorNumerico(0);
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialData]);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    if (!inputValue) {
      setValor("");
      setValorNumerico(0);
      return;
    }
    const numValue = Number(inputValue) / 100;
    setValorNumerico(numValue);
    setValor(
      numValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        nome,
        descricao,
        icone: selectedIcon,
        cor: selectedColor,
        plannedBudget: valorNumerico,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-border/50 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border/50 bg-muted/30">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            {isEditing ? "Editar Categoria e Limite" : "Nova Categoria"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div className="bg-[#2B5BBA]/5 border border-[#2B5BBA]/20 rounded-2xl p-4">
              <label className="block text-sm font-bold text-[#2B5BBA] mb-2 uppercase tracking-wider">
                Limite do Mês (Orçamento)
              </label>
              <input
                type="text"
                value={valor}
                onChange={handleValorChange}
                placeholder="R$ 0,00"
                className="w-full bg-transparent text-2xl font-bold text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Deixe em branco para não definir limite.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome da Categoria
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={isSystem}
                className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl text-foreground focus:ring-2 focus:ring-[#2B5BBA] outline-none transition-all disabled:opacity-60"
                required
              />
              {isSystem && (
                <p className="text-xs text-muted-foreground mt-1">
                  Categorias base do sistema não podem ser renomeadas.
                </p>
              )}
            </div>

            <div
              className={`space-y-4 ${isSystem ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Ícone
                </label>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map(({ id, component: IconComponent }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedIcon(id)}
                      className={`p-3 rounded-xl transition-all ${
                        selectedIcon === id
                          ? `${selectedColor} text-white shadow-md scale-105`
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <IconComponent size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Cor
                </label>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${color} ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 dark:ring-offset-zinc-900 ring-current scale-110"
                          : "hover:scale-110 opacity-80 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-border/50 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#2B5BBA] hover:bg-[#1e4594] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isSaving && <Loader2 size={18} className="animate-spin" />}
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
