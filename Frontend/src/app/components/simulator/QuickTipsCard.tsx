import { Lightbulb, TrendingUp, PiggyBank, Calendar } from "lucide-react";

export function QuickTipsCard() {
  const tips = [
    {
      icon: TrendingUp,
      text: "Aportes regulares potencializam ganhos com juros compostos",
    },
    { icon: PiggyBank, text: "Invista sempre respeitando a duração da meta" },
    {
      icon: Calendar,
      text: "Diversifique seus investimentos para reduzir riscos",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#2B5BBA] to-[#4C7FEE] rounded-3xl p-5 md:p-6 text-white shadow-md">
      <div className="flex items-center gap-3 mb-5 md:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
          <Lightbulb className="text-white w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight">
          Dicas Rápidas
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-2.5 sm:gap-3 bg-black/10 p-3 rounded-xl backdrop-blur-sm"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-white/95 mt-0.5">
                {tip.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
