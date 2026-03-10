import { useNavigate } from 'react-router';
import { SignupCard } from '../components/signup/SignupCard';
import { SignupPanel } from '../components/signup/SignupPanel';

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
    console.log('Cadastro:', data);
    // Aqui você implementaria a lógica de criação de conta
    // navigate('/login'); // Após cadastro bem-sucedido
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleTermsClick = () => {
    console.log('Abrir Termos de Uso');
    // Aqui você implementaria a abertura dos termos
  };

  const handlePrivacyClick = () => {
    console.log('Abrir Política de Privacidade');
    // Aqui você implementaria a abertura da política
  };

  return (
    <main className="flex min-h-screen bg-gray-50">
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
    </main>
  );
}
