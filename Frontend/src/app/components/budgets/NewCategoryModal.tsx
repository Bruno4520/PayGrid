import React, { useState, useEffect } from "react";
import {
  X,
  Home,
  ShoppingCart,
  Car,
  HeartPulse,
  Utensils,
  Music,
  GraduationCap,
  Zap,
  MoreHorizontal,
} from "lucide-react";

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: any) => void;
  initialData?: any;
}

const ICONS = [
  { id: "home", component: Home },
  { id: "shopping", component: ShoppingCart },
  { id: "car", component: Car },
  { id: "health", component: HeartPulse },
  { id: "food", component: Utensils },
  { id: "music", component: Music },
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
}: NewCategoryModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("home");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNome(initialData.nome || "");
        setDescricao(initialData.descricao || "");
        setSelectedIcon(initialData.icone || "home");
        setSelectedColor(initialData.cor || COLORS[0]);
      } else {
        setNome("");
        setDescricao("");
        setSelectedIcon("home");
        setSelectedColor(COLORS[0]);
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nome,
      descricao,
      icone: selectedIcon,
      cor: selectedColor,
    });
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = !!initialData;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto border border-border/50 animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-card/80 backdrop-blur-md border-b border-border/50 px-8 py-5 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl font-bold tracking-tight">
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Assinaturas"
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descrição (Opcional)
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Netflix, Spotify..."
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Ícone
            </label>
            <div className="grid grid-cols-5 gap-3">
              {ICONS.map((icon) => {
                const IconComponent = icon.component;
                const isSelected = selectedIcon === icon.id;
                return (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => setSelectedIcon(icon.id)}
                    className={`h-12 flex items-center justify-center rounded-xl transition-all ${
                      isSelected
                        ? `${selectedColor} text-white shadow-md scale-105 ring-2 ring-offset-2 dark:ring-offset-zinc-900 ring-current`
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <IconComponent size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Cor
            </label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-all ${color} ${
                      isSelected
                        ? "ring-2 ring-offset-2 dark:ring-offset-zinc-900 ring-current scale-110"
                        : "hover:scale-110 opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`Selecionar cor ${color}`}
                  />
                );
              })}
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
              className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#2B5BBA] hover:bg-[#1e4594] transition-all shadow-lg shadow-blue-500/20"
            >
              {isEditing ? "Salvar" : "Criar Categoria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
