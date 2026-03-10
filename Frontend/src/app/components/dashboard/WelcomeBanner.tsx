import { Plus } from 'lucide-react';

interface WelcomeBannerProps {
  onAddTransaction: () => void;
}

export function WelcomeBanner({ onAddTransaction }: WelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-[#2B5BBA] to-[#4C7FEE] rounded-2xl p-8 text-center">
      <h2 className="text-2xl font-semibold text-white mb-2">
        Bem-vindo ao PayGrid!
      </h2>
      <p className="text-white/90 mb-6 max-w-2xl mx-auto">
        Comece a organizar suas finanças adicionando sua primeira transação. Nossa plataforma irá ajudará a ter controle total sobre seu dinheiro.
      </p>
      <button
        onClick={onAddTransaction}
        className="inline-flex items-center gap-2 bg-white text-[#2B5BBA] px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
      >
        <Plus size={20} />
        Adicionar Primeira Transação
      </button>
    </div>
  );
}
