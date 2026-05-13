import { useNavigate } from "react-router";
import { LoginCard } from "../components/login/LoginCard";
import { OnboardingPanel } from "../components/login/OnboardingPanel";
import { ThemeToggle } from "../components/ui/theme-toggle";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (data: LoginFormData) => {
    console.log("Login:", data);
    navigate("/dashboard");
  };

  const handleForgotPassword = () => {
    navigate("/recuperar-senha");
  };

  const handleCreateAccount = () => {
    navigate("/cadastro");
  };

  return (
    <main className="flex min-h-screen bg-background transition-colors duration-300">
      {/* Seção do Formulário de Login */}
      <section className="flex items-center justify-center w-full lg:w-1/2 p-6 sm:p-12">
        <LoginCard
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          onCreateAccount={handleCreateAccount}
        />
      </section>
      <section className="hidden lg:block lg:w-1/2 relative">
        <OnboardingPanel />
      </section>

      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </main>
  );
}
