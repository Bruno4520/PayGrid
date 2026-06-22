import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Lock, LogOut, ShieldAlert, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { ChangePasswordModal } from "../components/password/ChangePasswordModal";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../../services/api";

export function SettingsPage() {
  const { user, signOut, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.nome || "");
  const email = user?.email || "";

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.nome);
    }
  }, [user]);

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSaving(true);
      await api.put("/usuarios/perfil", { nome: name });

      updateUser({ nome: name });

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Erro ao atualizar o perfil. Tente novamente.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "TEM A CERTEZA ABSOLUTA? Esta ação é irreversível. Todos os seus orçamentos, contas, cartões e transações serão apagados permanentemente.",
    );

    if (confirmDelete) {
      try {
        setIsDeleting(true);
        await api.delete("/usuarios/conta");
        toast.success(
          "A sua conta e todos os dados foram excluídos com sucesso.",
        );
        signOut();
        navigate("/login");
      } catch (error) {
        const message =
          isAxiosError(error) && error.response?.data?.mensagem
            ? error.response.data.mensagem
            : "Erro ao excluir a conta.";
        toast.error(message);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
              Meu Perfil
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Gerencie as suas informações pessoais e preferências da conta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm border border-border/50 transition-colors">
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#2B5BBA] to-[#4C7FEE] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg uppercase">
                    {name ? name.charAt(0) : "U"}
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-foreground mt-3 sm:mt-4 text-center">
                    {user?.nome}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground text-center break-all">
                    {email}
                  </p>
                </div>

                <form
                  className="space-y-5 sm:space-y-6"
                  onSubmit={handleUpdateProfile}
                >
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 sm:py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 sm:py-3.5 bg-muted/30 border border-transparent rounded-xl text-muted-foreground cursor-not-allowed font-medium opacity-80 text-sm sm:text-base"
                    />
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-1.5 sm:mt-2">
                      O e-mail não pode ser alterado por aqui. Contate o suporte
                      se necessário.
                    </p>
                  </div>

                  <div className="pt-4 sm:pt-4 mt-6 sm:mt-8 border-t border-border/50">
                    <button
                      type="submit"
                      disabled={isSaving || name === user?.nome}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-[#2B5BBA] text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isSaving ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : null}
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-border/50 transition-colors">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">
                  Segurança
                </h3>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Lock
                      size={18}
                      className="text-muted-foreground group-hover:text-foreground transition-colors sm:w-[18px] sm:h-[18px] w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      Alterar Senha
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-muted-foreground group-hover:text-foreground transition-colors sm:w-[18px] sm:h-[18px] w-4 h-4"
                  />
                </button>
              </div>

              <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-red-500/20 transition-colors">
                <h3 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mb-4">
                  Conta
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-colors font-bold text-xs sm:text-sm"
                  >
                    <LogOut
                      size={18}
                      className="sm:w-[18px] sm:h-[18px] w-4 h-4"
                    />
                    Sair da Conta
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-center gap-2 p-3.5 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-colors font-bold text-xs sm:text-sm mt-2 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2
                        size={18}
                        className="animate-spin sm:w-[18px] sm:h-[18px] w-4 h-4"
                      />
                    ) : (
                      <ShieldAlert
                        size={18}
                        className="sm:w-[18px] sm:h-[18px] w-4 h-4"
                      />
                    )}
                    Excluir a minha conta
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
