import { useNavigate } from 'react-router';
import { LoginCard } from '../components/login/LoginCard';
import { OnboardingPanel } from '../components/login/OnboardingPanel';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (data: LoginFormData) => {
    console.log('Login:', data);
    // Aqui você implementaria a lógica de autenticação
    navigate('/dashboard'); // Após login bem-sucedido
  };

  const handleForgotPassword = () => {
    navigate('/recuperar-senha');
  };

  const handleCreateAccount = () => {
    navigate('/cadastro');
  };

  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* Login Section */}
      <section className="flex items-center justify-center w-full lg:w-1/2 p-6 lg:p-12">
        <LoginCard
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          onCreateAccount={handleCreateAccount}
        />
      </section>

      {/* Onboarding Panel - Hidden on mobile */}
      <section className="hidden lg:block lg:w-1/2">
        <OnboardingPanel />
      </section>
    </main>
  );
}