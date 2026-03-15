import { useNavigate } from "react-router";
import { ForgotPasswordCard } from "../components/forgot-password/ForgotPasswordCard";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSendLink = (email: string) => {
    console.log("Enviar link de recuperação para:", email);
    // Aqui você implementaria a lógica de envio do e-mail de recuperação
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center p-6">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-32 right-32 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

      <ForgotPasswordCard
        onSendLink={handleSendLink}
        onBackToLogin={handleBackToLogin}
      />
    </main>
  );
}
