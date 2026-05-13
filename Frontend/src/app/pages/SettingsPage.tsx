import { useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { Camera, Lock, LogOut, ShieldAlert, ChevronRight } from "lucide-react";
import { ChangePasswordModal } from "../components/password/ChangePasswordModal";

export function SettingsPage() {
  const [name, setName] = useState("João Silva");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const email = "joao.silva@email.com";

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={name} userRole="Administrador" />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground font-medium">
              Gerencie suas informações pessoais e preferências da conta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* LADO ESQUERDO: Formulário Principal */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl p-8 shadow-sm border border-border/50 transition-colors">
                {/* Foto do Usuário */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#2B5BBA] to-[#4C7FEE] flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:opacity-90 transition-opacity">
                      {name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#2B5BBA] rounded-full border-2 border-card flex items-center justify-center shadow-sm">
                      <Camera size={14} className="text-white" />
                    </div>
                  </div>
                  <button className="mt-3 text-sm font-bold text-[#2B5BBA] dark:text-[#5588ff] hover:underline">
                    Alterar Foto
                  </button>
                </div>

                {/* Formulário */}
                <form
                  className="space-y-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3.5 bg-muted/30 border border-transparent rounded-xl text-muted-foreground cursor-not-allowed font-medium opacity-80"
                    />
                    <p className="text-xs font-medium text-muted-foreground mt-2">
                      O e-mail não pode ser alterado por aqui. Contate o suporte
                      se necessário.
                    </p>
                  </div>

                  <div className="pt-4 mt-8 border-t border-border/50">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#2B5BBA] text-white rounded-xl hover:opacity-90 transition-opacity font-bold shadow-lg shadow-blue-500/20"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* LADO DIREITO: Ações Rápidas e Segurança */}
            <div className="space-y-6">
              {/* Segurança */}
              <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Segurança
                </h3>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Lock
                      size={18}
                      className="text-muted-foreground group-hover:text-foreground transition-colors"
                    />
                    <span className="text-sm font-bold text-foreground">
                      Alterar Senha
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-muted-foreground group-hover:text-foreground transition-colors"
                  />
                </button>
              </div>

              {/* Zona de Perigo / Conta */}
              <div className="bg-card rounded-3xl p-6 shadow-sm border border-red-500/20 transition-colors">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
                  Conta
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-colors font-bold text-sm">
                    <LogOut size={18} />
                    Sair da Conta
                  </button>

                  <button className="w-full flex items-center justify-center gap-2 p-3.5 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors font-bold text-sm mt-2">
                    <ShieldAlert size={18} />
                    Excluir minha conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
