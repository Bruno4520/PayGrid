import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginCardProps {
  onLogin: (data: LoginFormData) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

export function LoginCard({ onLogin, onForgotPassword, onCreateAccount }: LoginCardProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(formData);
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-12">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#2B5BBA] rounded-2xl flex items-center justify-center mb-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 13L6 10L10 14L18 6L21 9"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 20H21"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">PayGrid</h1>
        <p className="text-sm text-gray-600">Entre na sua conta para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
            E-mail
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="seu@email.com"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="remember" className="flex items-center cursor-pointer">
            <input
              id="remember"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              className="w-4 h-4 text-[#2B5BBA] border-gray-300 rounded focus:ring-2 focus:ring-[#2B5BBA] cursor-pointer"
            />
            <span className="ml-2 text-sm text-gray-700">Lembrar de mim</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-[#2B5BBA] hover:text-[#1e4594] transition-colors"
          >
            Esqueci minha senha
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#2B5BBA] text-white py-3.5 rounded-xl hover:bg-[#1e4594] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:ring-offset-2"
        >
          Entrar
        </button>

        <div className="text-center pt-4">
          <span className="text-sm text-gray-600">Não tem uma conta? </span>
          <button
            type="button"
            onClick={onCreateAccount}
            className="text-sm text-[#2B5BBA] hover:text-[#1e4594] transition-colors"
          >
            Criar conta
          </button>
        </div>
      </form>
    </div>
  );
}
