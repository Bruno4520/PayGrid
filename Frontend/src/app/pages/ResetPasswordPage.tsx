import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { isAxiosError } from "axios";
import { api } from "../../services/api";
import { ThemeToggle } from "../components/ui/theme-toggle";


const PASSWORD_REQUIREMENTS_MESSAGE =
  "A senha deve ter no mínimo 8 caracteres, 1 número e 1 caractere especial.";

const isStrongPassword = (password: string): boolean => {
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return minLength && hasNumber && hasSpecialChar;
};

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const passwordValidationState = newPassword
    ? isStrongPassword(newPassword)
    : null;

  useEffect(() => {
    if (!token) {
      setError("Token de redefinição de senha ausente ou inválido.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) return;

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/usuarios/redefinir-senha", {
        token,
        novaSenha: newPassword,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Ocorreu um erro ao redefinir a senha. O token pode ter expirado.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2B5BBA]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-card text-card-foreground rounded-3xl p-8 shadow-2xl shadow-black/5 border border-border/50 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#2B5BBA]/10 rounded-2xl flex items-center justify-center">
            <Lock size={32} className="text-[#2B5BBA] dark:text-[#5588ff]" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Redefinir Senha
          </h2>
          <p className="text-muted-foreground text-sm font-medium">
            Crie uma nova senha forte e segura para a sua conta.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium mb-6 text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Senha Alterada!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Sua senha foi redefinida com sucesso. Você será redirecionado para
              o login.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-bold text-[#2B5BBA] hover:underline"
            >
              Fazer login agora <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="w-full pl-4 pr-12 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
                  required
                  disabled={isLoading || !token}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  disabled={isLoading || !token}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 disabled:opacity-50"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <p
                className={
                  "text-xs mt-2 mb-3 font-medium " +
                  (passwordValidationState === null
                    ? "text-muted-foreground"
                    : passwordValidationState
                      ? "text-emerald-500"
                      : "text-red-500")
                }
              >
                Mínimo 8 caracteres, 1 número e 1 caractere especial
              </p>

              <label className="block text-sm font-medium text-foreground mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full pl-4 pr-12 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
                  required
                  disabled={isLoading || !token}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={isLoading || !token}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 disabled:opacity-50"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 font-medium mt-2">
                    As senhas não coincidem.
                  </p>
                )}
              {newPassword &&
                confirmPassword &&
                newPassword === confirmPassword && (
                  <p className="text-xs text-emerald-500 font-medium mt-2 flex items-center gap-1">
                    <ShieldCheck size={14} /> Senhas coincidem
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={
                isLoading ||
                !token ||
                !newPassword ||
                !confirmPassword ||
                !isStrongPassword(newPassword) ||
                newPassword !== confirmPassword
              }
              className="w-full py-4 mt-4 rounded-xl font-bold text-white bg-[#2B5BBA] hover:bg-[#1e4594] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              {isLoading ? "Salvando..." : "Redefinir Senha"}
            </button>
          </form>
        )}
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
