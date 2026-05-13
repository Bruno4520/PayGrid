import { Plus } from "lucide-react";

interface AddCategoryCardProps {
  onClick: () => void;
}

export function AddCategoryCard({ onClick }: AddCategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-card/50 rounded-3xl p-6 shadow-sm border-2 border-dashed border-border hover:border-[#2B5BBA] hover:bg-muted/30 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] group"
    >
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2B5BBA] transition-colors">
        <Plus
          size={32}
          className="text-muted-foreground group-hover:text-white transition-colors"
        />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">Novo Orçamento</h3>
      <p className="text-sm font-medium text-muted-foreground text-center">
        Defina um novo limite para uma categoria
      </p>
    </button>
  );
}
