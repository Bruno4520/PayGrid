import { useState } from "react";
import { Mail, Send, ArrowLeft, Key } from "lucide-react";

interface ForgotPasswordCardProps {
  onSendLink: (email: string) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordCard({
  onSendLink,
  onBackToLogin,
}: ForgotPasswordCardProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendLink(email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-xl border border-border/50 overflow-hidden transition-colors duration-300">
        {/* Success Header */}
        <div className="bg-linear-to-br from-[#2B5BBA] to-[#4C7FEE] px-12 py-16 flex items-center justify-center relative overflow-hidden">
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
          <h2 className="text-2xl font-semibold text-center mb-4">
            E-mail enviado!
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
            Se existe uma conta associada a <strong>{email}</strong>, você
            receberá um link para redefinir sua senha em alguns minutos.
          </p>

          <button
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center gap-2 text-[#2B5BBA] hover:text-[#1e4594] dark:hover:text-[#5588ff] transition-colors py-3 font-medium"
          >
            <ArrowLeft size={18} />
            <span>Voltar ao login</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-card text-card-foreground rounded-3xl shadow-xl border border-border/50 overflow-hidden transition-colors duration-300">
      {/* Header with illustration */}
      <div className="bg-linear-to-br from-[#2B5BBA] to-[#4C7FEE] px-12 py-16 flex items-center justify-center relative overflow-hidden">
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
        <h2 className="text-2xl font-semibold text-center mb-4">
          Recuperar senha
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
          Enviaremos um link de redefinição de senha para o e-mail informado.
          Verifique sua caixa de entrada e siga as instruções.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-transparent rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2B5BBA] text-white font-medium py-3.5 rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:ring-offset-2 dark:focus:ring-offset-zinc-900 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            <span>Enviar link</span>
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-3 font-medium"
          >
            <ArrowLeft size={18} />
            <span>Voltar ao login</span>
          </button>
        </form>
      </div>
    </div>
  );
}
