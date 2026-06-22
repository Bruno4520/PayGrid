import { Wifi } from "lucide-react";

export interface CardItemData {
  id: string;
  name: string;
  lastDigits: string;
  limit: number;
  usedLimit: number;
  closingDay: number;
  dueDay: number;
  color: string;
}

interface CreditCardItemProps extends CardItemData {
  isActive: boolean;
  onClick: () => void;
}

export function CreditCardItem({
  name,
  lastDigits,
  color,
  isActive,
  onClick,
}: CreditCardItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full max-w-[400px] mx-auto aspect-[1.586/1] relative overflow-hidden rounded-2xl p-5 md:p-6 text-left flex flex-col justify-between transition-all duration-300 ${
        isActive
          ? `ring-2 ring-offset-2 ring-[#2B5BBA] dark:ring-offset-zinc-900 scale-[1.02] shadow-xl shadow-blue-900/10`
          : "opacity-80 hover:opacity-100 hover:scale-[1.01]"
      } bg-gradient-to-br ${color} text-white`}
    >
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start z-10">
        <h3 className="text-lg md:text-xl font-extrabold tracking-widest drop-shadow-md">
          {name.toUpperCase()}
        </h3>
        <Wifi
          size={24}
          className="opacity-80 rotate-90 drop-shadow-sm md:w-6 md:h-6 w-5 h-5"
        />
      </div>

      <div className="z-10 mt-auto">
        <div className="w-10 h-7 md:w-12 md:h-9 bg-gradient-to-br from-[#FFD700] to-[#DAA520] rounded-md mb-4 md:mb-6 shadow-inner flex items-center justify-center opacity-90">
          <div className="w-full h-px bg-black/20" />
        </div>
        <div className="flex justify-between items-end">
          <p className="text-xl md:text-2xl font-mono tracking-[0.2em] drop-shadow-md opacity-90">
            •••• {lastDigits}
          </p>
        </div>
      </div>
    </button>
  );
}
