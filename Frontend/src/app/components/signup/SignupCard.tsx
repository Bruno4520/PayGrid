import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  isDemoAccount: boolean;
}

export interface SignupCardProps {
  onSignup: (data: SignupFormData) => void;
  onLogin: () => void;
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  isLoading?: boolean;
}

export function SignupCard({
  onSignup,
  onLogin,
  onTermsClick,
  onPrivacyClick,
  isLoading = false,
}: SignupCardProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
    isDemoAccount: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasNumber && hasSpecialChar;
  };

  const handleInputChange = (
    field: keyof SignupFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Nome completo é obrigatório";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
    if (!validatePassword(formData.password))
      newErrors.password = "A senha não atende aos requisitos mínimos";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem";
    if (!formData.acceptedTerms)
      newErrors.acceptedTerms = "Você deve aceitar os termos";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSignup(formData);
  };

  const isPasswordValid = formData.password
    ? validatePassword(formData.password)
    : null;

  return (
    <div className="w-full max-w-md bg-card text-card-foreground rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 border border-border/50 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2B5BBA] rounded-xl flex items-center justify-center shadow-md shrink-0">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
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
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          PayGrid
        </h1>
      </div>

      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-1.5 sm:mb-2">
          Crie sua conta
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Comece a organizar suas finanças de forma inteligente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
          >
            Nome completo
          </label>
          <input
            id="fullName"
            type="text"
            disabled={isLoading}
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Digite seu nome completo"
            className={`w-full px-4 py-3 sm:py-3.5 bg-muted/50 border ${errors.fullName ? "border-red-500" : "border-transparent"} rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all text-sm sm:text-base`}
            required
          />
          {errors.fullName && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            disabled={isLoading}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="seu@email.com"
            className={`w-full px-4 py-3 sm:py-3.5 bg-muted/50 border ${errors.email ? "border-red-500" : "border-transparent"} rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all text-sm sm:text-base`}
            required
          />
          {errors.email && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
          >
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Digite sua senha"
              className={`w-full px-4 pr-12 py-3 sm:py-3.5 bg-muted/50 border ${errors.password ? "border-red-500" : "border-transparent"} rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all text-sm sm:text-base`}
              required
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff size={18} className="w-[18px] h-[18px]" />
              ) : (
                <Eye size={18} className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
          <p
            className={`text-[10px] sm:text-xs mt-1.5 ${isPasswordValid === null ? "text-muted-foreground" : isPasswordValid ? "text-green-500" : "text-red-500"}`}
          >
            Mínimo 8 caracteres, 1 número e 1 caractere especial
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
          >
            Confirmar senha
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              disabled={isLoading}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="Digite novamente sua senha"
              className={`w-full px-4 pr-12 py-3 sm:py-3.5 bg-muted/50 border ${errors.confirmPassword ? "border-red-500" : "border-transparent"} rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all text-sm sm:text-base`}
              required
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} className="w-[18px] h-[18px]" />
              ) : (
                <Eye size={18} className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <div
          className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-300 gap-2 ${formData.isDemoAccount ? "bg-[#2B5BBA]/5 border-[#2B5BBA]/30" : "bg-muted/30 border-border/50 hover:border-[#2B5BBA]/30"}`}
        >
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
              Conta de Demonstração
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
              Preencher com dados para teste
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={formData.isDemoAccount}
              onChange={(e) =>
                handleInputChange("isDemoAccount", e.target.checked)
              }
              disabled={isLoading}
            />
            <div className="w-10 h-5 sm:w-11 sm:h-6 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#2B5BBA]"></div>
          </label>
        </div>

        <div>
          <label
            htmlFor="terms"
            className="flex items-start cursor-pointer group"
          >
            <input
              id="terms"
              type="checkbox"
              disabled={isLoading}
              checked={formData.acceptedTerms}
              onChange={(e) =>
                handleInputChange("acceptedTerms", e.target.checked)
              }
              className="w-4 h-4 text-[#2B5BBA] bg-muted border-muted-foreground/30 rounded focus:ring-[#2B5BBA] cursor-pointer mt-0.5 shrink-0"
            />
            <span className="ml-2.5 text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
              Li e aceito os{" "}
              <button
                type="button"
                onClick={onTermsClick}
                className="text-[#2B5BBA] hover:text-[#1e4594] dark:hover:text-[#5588ff] underline transition-colors"
              >
                Termos de Uso
              </button>{" "}
              e{" "}
              <button
                type="button"
                onClick={onPrivacyClick}
                className="text-[#2B5BBA] hover:text-[#1e4594] dark:hover:text-[#5588ff] underline transition-colors"
              >
                Política de Privacidade
              </button>
            </span>
          </label>
          {errors.acceptedTerms && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1">
              {errors.acceptedTerms}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2B5BBA] text-white font-medium py-3.5 mt-2 rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base shadow-md shadow-blue-500/20"
        >
          {isLoading ? (
            <span className="animate-pulse">Criando conta...</span>
          ) : (
            "Criar conta"
          )}
        </button>

        <div className="text-center pt-5 mt-2 border-t border-border/50">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Já tem uma conta?{" "}
          </span>
          <button
            type="button"
            disabled={isLoading}
            onClick={onLogin}
            className="text-xs sm:text-sm font-bold text-[#2B5BBA] hover:text-[#1e4594] dark:hover:text-[#5588ff] transition-colors"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
