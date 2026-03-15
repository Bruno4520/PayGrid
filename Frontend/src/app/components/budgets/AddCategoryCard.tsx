import { Plus } from "lucide-react";

interface AddCategoryCardProps {
  onClick: () => void;
}

export function AddCategoryCard({ onClick }: AddCategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-gray-300 transition-all flex flex-col items-center justify-center min-h-[200px] group"
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
        <Plus
          size={32}
          className="text-gray-400 group-hover:text-gray-600 transition-colors"
        />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        Adicionar Categoria
      </h3>
      <p className="text-sm text-gray-500 text-center">
        Crie um novo orçamento para uma categoria
      </p>
    </button>
  );
}
