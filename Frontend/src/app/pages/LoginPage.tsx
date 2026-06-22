import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoginCard, type LoginFormData } from "../components/login/LoginCard";
import { OnboardingPanel } from "../components/login/OnboardingPanel";
import { api } from "../../services/api";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "../components/ui/theme-toggle";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await api.post("/usuarios/login", {
        email: data.email,
        senha: data.password,
        lembrar: data.rememberMe,
      });

      const { token } = response.data;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userResponse = await api.get("/usuarios/perfil");
      signIn(token, userResponse.data);

      toast.success("Bem-vindo de volta!");
      navigate("/dashboard");
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Erro ao realizar login.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background">
      <section className="flex items-center justify-center w-full lg:w-1/2 p-4 sm:p-8 md:p-12">
        <LoginCard
          onLogin={handleLogin}
          onForgotPassword={() => navigate("/recuperar-senha")}
          onCreateAccount={() => navigate("/cadastro")}
          isLoading={loading}
        />
      </section>
      <section className="hidden lg:flex w-1/2">
        <OnboardingPanel />
      </section>
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </main>
  );
}
