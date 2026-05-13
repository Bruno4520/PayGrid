import { Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [greeting, setGreeting] = useState("Olá");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Bom dia");
    else if (hour >= 12 && hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  if (!hasTransactions) {
    return (
      <div className="bg-gradient-to-r from-[#2B5BBA] to-[#4C7FEE] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-blue-900/10">
        <div className="text-left mb-6 md:mb-0 md:mr-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">
            Bem-vindo ao PayGrid, {userName}!
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">
            Comece a organizar suas finanças adicionando sua primeira transação.
            Nossa plataforma o ajudará a ter controle total sobre seu dinheiro.
          </p>
        </div>

        <button
          onClick={onAddTransaction}
          className="shrink-0 inline-flex items-center gap-2 bg-white text-[#2B5BBA] px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Primeira Transação
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm transition-colors duration-300 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#2B5BBA]/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-6 md:mb-0 relative z-10">
        <div className="hidden sm:flex w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center text-blue-600 dark:text-blue-400">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {greeting}, {userName}! 👋
          </h2>
          <p className="text-muted-foreground text-sm font-medium">
            Aqui está o resumo das suas finanças de hoje. Continue no controle!
          </p>
        </div>
      </div>

      <button
        onClick={onAddTransaction}
        className="shrink-0 inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:ring-offset-2 dark:focus:ring-offset-zinc-900 relative z-10"
      >
        <Plus size={20} />
        Nova Movimentação
      </button>
    </div>
  );
}
