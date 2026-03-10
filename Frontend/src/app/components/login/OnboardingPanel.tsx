import { useState, useEffect } from 'react';
import { TrendingUp, Settings, PieChart, Wallet } from 'lucide-react';

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Gerencie suas finanças com facilidade',
    description: 'Tenha controle total sobre seu dinheiro com nossa plataforma intuitiva e segura.',
  },
  {
    id: 2,
    title: 'Organize seus gastos de forma inteligente',
    description: 'Crie categorias personalizadas e acompanhe seus gastos em tempo real.',
  },
  {
    id: 3,
    title: 'Alcance seus objetivos financeiros',
    description: 'Defina suas metas e veja como você está indo, tudo em um só lugar.',
  },
];

export function OnboardingPanel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#2B5BBA] via-[#3d6fd8] to-[#5588ff] overflow-hidden flex items-center justify-center p-12">
      {/* Floating Icons */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float">
        <Settings className="text-white/80" size={28} />
      </div>
      <div className="absolute top-32 right-24 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float-delayed">
        <PieChart className="text-white/80" size={24} />
      </div>
      <div className="absolute bottom-32 left-16 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float-slow">
        <Wallet className="text-white/80" size={24} />
      </div>
      <div className="absolute bottom-24 right-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float">
        <TrendingUp className="text-white/80" size={28} />
      </div>

      {/* Central Circle Illustration */}
      <div className="absolute w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]">
        <div className="relative w-full h-full">
          {/* Outer circle */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          {/* Middle circle */}
          <div className="absolute inset-[60px] rounded-full border-4 border-white/15"></div>
          {/* Inner element - card representation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-48 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/30">
            <div className="absolute top-6 left-6 right-6 h-8 bg-white/30 rounded"></div>
            <div className="absolute bottom-6 left-6 right-6 h-12 bg-white/40 rounded"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl text-center mt-[300px]">
        <div className="min-h-[180px]">
          <h2 className="text-4xl font-semibold text-white mb-4 transition-all duration-500">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg text-white/90 leading-relaxed transition-all duration-500">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
