import React, { useState, useEffect } from "react";
import { X, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { api } from "../../../services/api";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("As novas senhas não coincidem.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setIsLoading(true);
      await api.put("/usuarios/senha", {
        senhaAtual: currentPassword,
        novaSenha: newPassword,
      });

      toast.success("Senha alterada com sucesso.");
      handleClose();
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Erro ao alterar a senha.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-border/50 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-muted/30 border-b border-border/50 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2B5BBA]/10 rounded-xl flex items-center justify-center">
              <Lock size={20} className="text-[#2B5BBA] dark:text-[#5588ff]" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Alterar Senha
              </h2>
              <p className="text-xs font-medium text-muted-foreground">
                Atualize sua credencial de acesso
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-bold mb-4">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-12 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-border/50 my-2" />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Pelo menos 6 caracteres"
                className="w-full pl-4 pr-12 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full pl-4 pr-12 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {newPassword &&
              confirmPassword &&
              newPassword === confirmPassword && (
                <p className="text-xs text-emerald-500 font-medium mt-2 flex items-center gap-1">
                  <ShieldCheck size={14} /> Senhas coincidem
                </p>
              )}
          </div>

          <div className="flex gap-4 pt-4 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3.5 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-[#2B5BBA] hover:bg-[#1e4594] disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              Salvar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
