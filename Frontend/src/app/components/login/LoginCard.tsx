import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginCardProps {
  onLogin: (data: LoginFormData) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
  isLoading?: boolean;
}

export function LoginCard({
  onLogin,
  onForgotPassword,
  onCreateAccount,
  isLoading = false,
}: LoginCardProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(formData);
  };

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-md bg-card text-card-foreground rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 border border-border/50 transition-colors duration-300">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#2B5BBA] rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-blue-900/20">
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8"
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
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 sm:mb-2">
          PayGrid
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground text-center">
          Entre na sua conta para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
          >
            E-mail
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail size={18} className="w-[18px] h-[18px]" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="seu@email.com"
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all text-sm sm:text-base"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
          >
            Senha
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock size={18} className="w-[18px] h-[18px]" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 sm:py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all text-sm sm:text-base"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff size={18} className="w-[18px] h-[18px]" />
              ) : (
                <Eye size={18} className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 pt-1">
          <label
            htmlFor="remember"
            className="flex items-center cursor-pointer group w-fit"
          >
            <input
              id="remember"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) =>
                handleInputChange("rememberMe", e.target.checked)
              }
              className="w-4 h-4 text-[#2B5BBA] bg-muted border-muted-foreground/30 rounded focus:ring-[#2B5BBA] cursor-pointer"
            />
            <span className="ml-2 text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Lembrar de mim
            </span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs sm:text-sm font-medium text-[#2B5BBA] hover:text-[#1e4594] dark:hover:text-[#5588ff] transition-colors self-start sm:self-auto"
          >
            Esqueci minha senha
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2B5BBA] text-white font-medium py-3.5 mt-2 rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base shadow-md shadow-blue-500/20"
        >
          {isLoading ? (
            <span className="animate-pulse">Conectando...</span>
          ) : (
            "Entrar"
          )}
        </button>

        <div className="text-center pt-5 mt-2 border-t border-border/50">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Não tem uma conta?{" "}
          </span>
          <button
            type="button"
            onClick={onCreateAccount}
            className="text-xs sm:text-sm font-bold text-[#2B5BBA] hover:text-[#1e4594] dark:hover:text-[#5588ff] transition-colors"
          >
            Criar conta
          </button>
        </div>
      </form>
    </div>
  );
}
