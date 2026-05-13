import { useNavigate } from "react-router";
import { SignupCard } from "../components/signup/SignupCard";
import { SignupPanel } from "../components/signup/SignupPanel";
import { ThemeToggle } from "../components/ui/theme-toggle";

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export function SignupPage() {
  const navigate = useNavigate();

  const handleSignup = (data: SignupFormData) => {
    console.log("Cadastro:", data);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleTermsClick = () => {
    console.log("Abrir Termos de Uso");
  };

  const handlePrivacyClick = () => {
    console.log("Abrir Política de Privacidade");
  };

  return (
    <main className="flex min-h-screen bg-background transition-colors duration-300">
      {/* Signup Section */}
      <section className="flex items-center justify-center w-full lg:w-1/2 p-6 lg:p-12">
        <SignupCard
          onSignup={handleSignup}
          onLogin={handleLogin}
          onTermsClick={handleTermsClick}
          onPrivacyClick={handlePrivacyClick}
        />
      </section>

      {/* Signup Panel - Hidden on mobile */}
      <section className="hidden lg:block lg:w-1/2">
        <SignupPanel />
      </section>

      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </main>
  );
}
