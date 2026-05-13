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
    <div className="bg-gradient-to-br from-[#2B5BBA] to-[#4C7FEE] rounded-3xl p-6 text-white shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Lightbulb size={24} className="text-white" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">Dicas Rápidas</h3>
      </div>

      <div className="space-y-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 bg-black/10 p-3 rounded-xl backdrop-blur-sm"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-white" />
              </div>
              <p className="text-sm font-medium text-white/95 mt-1">
                {tip.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
