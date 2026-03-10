import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

interface SignupCardProps {
  onSignup: (data: SignupFormData) => void;
  onLogin: () => void;
  onTermsClick: () => void;
  onPrivacyClick: () => void;
}

export function SignupCard({ onSignup, onLogin, onTermsClick, onPrivacyClick }: SignupCardProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasNumber && hasSpecialChar;
  };

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'A senha não atende aos requisitos mínimos';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = 'Você deve aceitar os termos';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSignup(formData);
  };

  const isPasswordValid = formData.password ? validatePassword(formData.password) : null;

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-[#2B5BBA] rounded-xl flex items-center justify-center">
          <svg
            width="24"
            height="24"
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
        <h1 className="text-2xl font-semibold text-gray-900">PayGrid</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Crie sua conta</h2>
        <p className="text-sm text-gray-600">Comece a organizar suas finanças de forma inteligente</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm text-gray-700 mb-2">
            Nome completo
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Digite seu nome completo"
            className={`w-full px-4 py-3 bg-gray-50 border ${
              errors.fullName ? 'border-red-500' : 'border-gray-200'
            } rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent transition-all`}
            required
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="seu@email.com"
            className={`w-full px-4 py-3 bg-gray-50 border ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            } rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent transition-all`}
            required
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Digite sua senha"
              className={`w-full px-4 pr-12 py-3 bg-gray-50 border ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              } rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent transition-all`}
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
          <p className={`text-xs mt-1 ${
            isPasswordValid === null ? 'text-gray-500' : isPasswordValid ? 'text-green-600' : 'text-red-500'
          }`}>
            Mínimo 8 caracteres, 1 número e 1 caractere especial
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
            Confirmar senha
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Digite novamente sua senha"
              className={`w-full px-4 pr-12 py-3 bg-gray-50 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
              } rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent transition-all`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="terms" className="flex items-start cursor-pointer">
            <input
              id="terms"
              type="checkbox"
              checked={formData.acceptedTerms}
              onChange={(e) => handleInputChange('acceptedTerms', e.target.checked)}
              className="w-4 h-4 text-[#2B5BBA] border-gray-300 rounded focus:ring-2 focus:ring-[#2B5BBA] cursor-pointer mt-0.5"
            />
            <span className="ml-2 text-sm text-gray-700">
              Li e aceito os{' '}
              <button
                type="button"
                onClick={onTermsClick}
                className="text-[#2B5BBA] hover:text-[#1e4594] underline transition-colors"
              >
                Termos de Uso
              </button>
              {' '}e{' '}
              <button
                type="button"
                onClick={onPrivacyClick}
                className="text-[#2B5BBA] hover:text-[#1e4594] underline transition-colors"
              >
                Política de Privacidade
              </button>
            </span>
          </label>
          {errors.acceptedTerms && (
            <p className="text-xs text-red-500 mt-1">{errors.acceptedTerms}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#2B5BBA] text-white py-3.5 rounded-xl hover:bg-[#1e4594] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:ring-offset-2"
        >
          Criar conta
        </button>

        <div className="text-center pt-4">
          <span className="text-sm text-gray-600">Já tem uma conta? </span>
          <button
            type="button"
            onClick={onLogin}
            className="text-sm text-[#2B5BBA] hover:text-[#1e4594] transition-colors"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
