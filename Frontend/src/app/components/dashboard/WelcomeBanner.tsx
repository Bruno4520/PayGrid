import { Plus } from "lucide-react";

interface WelcomeBannerProps {
  userName: string;
  hasTransactions: boolean;
  onAddTransaction: () => void;
}

export function WelcomeBanner({
  userName,
  hasTransactions,
  onAddTransaction,
}: WelcomeBannerProps) {
  if (!hasTransactions) {
    return (
      <div className="bg-gradient-to-r from-[#2B5BBA] to-[#4C7FEE] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-blue-900/10 text-center md:text-left">
        <div className="mb-6 md:mb-0 md:mr-8 max-w-2xl flex flex-col items-center md:items-start">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Bem-vindo ao PayGrid, {userName}!
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed font-medium">
            Comece a organizar as suas finanças adicionando a sua primeira
            transação. O nosso sistema vai ajudá-lo a ter controlo total sobre o
            seu dinheiro.
          </p>
        </div>
        <button
          onClick={onAddTransaction}
          className="shrink-0 inline-flex items-center gap-2 bg-white text-[#2B5BBA] px-6 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm w-full md:w-auto justify-center"
        >
          <Plus size={20} /> Primeira Transação
        </button>
      </div>
    );
  }

  return null;
}
