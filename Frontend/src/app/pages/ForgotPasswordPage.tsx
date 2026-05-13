import { useNavigate } from "react-router";
import { ForgotPasswordCard } from "../components/password/ForgotPasswordCard";

import { ThemeToggle } from "../components/ui/theme-toggle";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSendLink = (email: string) => {
    console.log("Enviar link de recuperação para:", email);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <main className="relative flex min-h-screen bg-background transition-colors duration-300 items-center justify-center p-6 overflow-hidden">
      {/* Decorative circles adaptados para funcionar bem com temas */}
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
