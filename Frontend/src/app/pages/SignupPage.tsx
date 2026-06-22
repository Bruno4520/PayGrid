import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  SignupCard,
  type SignupFormData,
} from "../components/signup/SignupCard";
import { SignupPanel } from "../components/signup/SignupPanel";
import { api } from "../../services/api";
import { ThemeToggle } from "../components/ui/theme-toggle";

export function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    try {
      if (data.isDemoAccount) {
        toast.info(
          "Criando conta e gerando simulações financeiras. Aguarde...",
          {
            duration: 8000,
          },
        );
      }

      await api.post("/usuarios", {
        nome: data.fullName,
        email: data.email,
        senha: data.password,
        popularComDadosTeste: data.isDemoAccount,
      });

      toast.success("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Erro ao criar conta.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background">
      <section className="flex items-center justify-center w-full lg:w-1/2 p-4 sm:p-8 md:p-12">
        <SignupCard
          onSignup={handleSignup}
          onLogin={() => navigate("/login")}
          onTermsClick={() => toast.info("Página em desenvolvimento.")}
          onPrivacyClick={() => toast.info("Seus dados estão protegidos.")}
          isLoading={loading}
        />
      </section>
      <section className="hidden lg:flex w-1/2">
        <SignupPanel />
      </section>
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </main>
  );
}
