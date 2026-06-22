import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ForgotPasswordCard } from "../components/password/ForgotPasswordCard";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { api } from "../../services/api";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSendLink = async (email: string) => {
    toast.info("Aguarde um instante...", {
      description:
        "Estamos gerando o link de redefinição. Evite clicar várias vezes.",
      duration: 5000,
    });

    try {
      const response = await api.post("/usuarios/recuperar-senha", { email });

      if (response.data?.debugLink) {
        toast.success("Link de redefinição gerado!", {
          description: (
            <a
              href={response.data.debugLink}
              className="underline font-bold text-[#2B5BBA]"
            >
              Abrir link de redefinição
            </a>
          ),
          duration: 20000,
        });

        return;
      }

      toast.success("Solicitação processada!", {
        description:
          response.data?.mensagem ||
          "Se o e-mail existir, o link de redefinição será disponibilizado.",
        duration: 7000,
      });
    } catch (error: any) {
      toast.error("Não foi possível processar a solicitação.");
      throw error;
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <main className="relative flex min-h-screen bg-background transition-colors duration-300 items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute top-20 left-20 w-32 h-32 bg-[#2B5BBA]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-32 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full flex justify-center">
        <ForgotPasswordCard
          onSendLink={handleSendLink}
          onBackToLogin={handleBackToLogin}
        />
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </main>
  );
}
