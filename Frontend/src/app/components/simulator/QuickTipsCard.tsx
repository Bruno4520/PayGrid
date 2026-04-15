import { Lightbulb, TrendingUp, PiggyBank, Calendar } from "lucide-react";

export function QuickTipsCard() {
  const tips = [
    {
      icon: TrendingUp,
      text: "Aportes regulares potencializam ganhos com juros compostos",
    },
    {
      icon: PiggyBank,
      text: "Invista sempre respeitando a duração da meta",
    },
    {
      icon: Calendar,
      text: "Diversifique seus investimentos para reduzir riscos",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#2B5BBA] to-[#1e4594] rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <Lightbulb size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold">Dicas Rápidas</h3>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={14} className="text-white" />
              </div>
              <p className="text-sm text-white/95">{tip.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
