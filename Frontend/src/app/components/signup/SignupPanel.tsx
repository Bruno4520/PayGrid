import {
  TrendingUp,
  CreditCard,
  PieChart,
  Wallet,
  DollarSign,
  Target,
  BarChart3,
  Receipt,
} from "lucide-react";

export function SignupPanel() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#2B5BBA] via-[#3d6fd8] to-[#5588ff] overflow-hidden flex items-center justify-center p-12">
      {/* Floating Icons - Top Section */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center animate-float">
        <Receipt className="text-white/80" size={20} />
      </div>

      <div className="absolute top-32 left-[35%] w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float-delayed">
        <CreditCard className="text-white/80" size={24} />
      </div>

      <div className="absolute top-28 right-[30%] w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center animate-float-slow">
        <PieChart className="text-white/80" size={22} />
      </div>

      {/* Floating Icons - Middle Section */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[25%] w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center animate-float">
        <DollarSign className="text-white/80" size={20} />
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-[28%] w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float-delayed">
        <TrendingUp className="text-white/80" size={22} />
      </div>

      {/* Floating Icons - Bottom Section */}
      <div className="absolute bottom-32 left-[32%] w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float-slow">
        <Wallet className="text-white/80" size={24} />
      </div>

      <div className="absolute bottom-28 right-[35%] w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center animate-float">
        <BarChart3 className="text-white/80" size={20} />
      </div>

      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float-delayed">
        <Target className="text-white/80" size={22} />
      </div>

      {/* Large Background Circles */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 max-w-xl text-center">
        <h2 className="text-4xl font-semibold text-white mb-4">
          Gerencie suas finanças com inteligência
        </h2>
        <p className="text-lg text-white/90 leading-relaxed">
          Organize, monitore e planeje seu futuro financeiro de forma simples e
          segura.
        </p>
      </div>
    </div>
  );
}
