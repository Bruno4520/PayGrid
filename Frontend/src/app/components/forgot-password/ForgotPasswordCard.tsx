import { useState } from 'react';
import { Mail, Send, ArrowLeft, Key } from 'lucide-react';

interface ForgotPasswordCardProps {
  onSendLink: (email: string) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordCard({ onSendLink, onBackToLogin }: ForgotPasswordCardProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendLink(email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-[#4C7FEE] to-[#5B8FFF] px-12 py-16 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-8 right-12 w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-16 left-8 w-2 h-2 bg-red-400 rounded-full"></div>
          <div className="absolute top-12 left-16 w-2 h-2 bg-purple-300 rounded-full"></div>
          
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Mail className="text-white" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Success Content */}
        <div className="px-12 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
            E-mail enviado!
          </h2>
          <p className="text-sm text-gray-600 text-center mb-8 leading-relaxed">
            Se existe uma conta associada a <strong>{email}</strong>, você receberá um link para redefinir sua senha em alguns minutos.
          </p>

          <button
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center gap-2 text-[#2B5BBA] hover:text-[#1e4594] transition-colors py-3"
          >
            <ArrowLeft size={18} />
            <span>Voltar ao login</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header with illustration */}
      <div className="bg-gradient-to-br from-[#4C7FEE] to-[#5B8FFF] px-12 py-16 flex items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-8 right-12 w-3 h-3 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-16 left-8 w-2 h-2 bg-red-400 rounded-full"></div>
        <div className="absolute top-12 left-16 w-2 h-2 bg-purple-300 rounded-full"></div>
        
        {/* Key illustration */}
        <div className="relative">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Key className="text-white" size={32} />
            </div>
          </div>
          
          {/* Lock elements below */}
          <div className="flex gap-3 justify-center mt-6">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-12 h-2 bg-white/40 rounded-full"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            </div>
          </div>
          <div className="flex gap-3 justify-center mt-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-16 h-2 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-12 py-10">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Recuperar senha
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8 leading-relaxed">
          Enviaremos um link de redefinição de senha para o e-mail informado. Verifique sua caixa de entrada e siga as instruções.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4C7FEE] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4C7FEE] text-white py-3.5 rounded-xl hover:bg-[#3d6fd8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4C7FEE] focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            <span>Enviar link</span>
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-3"
          >
            <ArrowLeft size={18} />
            <span>Voltar ao login</span>
          </button>
        </form>
      </div>
    </div>
  );
}
