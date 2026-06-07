import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  LogOut,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../../services/api";

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "warning" | "danger" | "info" | "success";
}

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const userName = user?.nome || "Usuário";
  const initial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotificacoes = async () => {
    try {
      const res = await api.get<Notificacao[]>("/notificacoes");
      setNotificacoes(res.data);
    } catch {
      setNotificacoes([]);
    }
  };

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/transacoes?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className="h-20 bg-card border-b border-border flex items-center justify-between px-6 md:px-8 transition-colors duration-300 sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-11 pr-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsDropdownOpen(false);
            }}
            className="p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-colors relative"
          >
            <Bell size={20} />
            {notificacoes.length > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-border/50 bg-muted/30">
                <h3 className="font-bold text-foreground">Notificações</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notificacoes.length > 0 ? (
                  notificacoes.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${notif.tipo === "danger" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}
                        >
                          {notif.tipo === "danger" ? (
                            <AlertCircle size={18} />
                          ) : (
                            <AlertTriangle size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {notif.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {notif.mensagem}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-muted-foreground font-medium">
                    Nenhuma notificação no momento.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-muted rounded-2xl transition-colors"
          >
            <div className="w-10 h-10 bg-linear-to-br from-[#2B5BBA] to-[#4C7FEE] text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
              {initial}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-foreground leading-none">
                {userName}
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Conta Pessoal
              </p>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-border/50 bg-muted/30">
                <p className="text-sm font-bold text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  Membro PayGrid
                </p>
              </div>

              <Link
                to="/configuracoes"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings size={18} />
                Meu Perfil
              </Link>

              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                Tema {isDarkMode ? "Claro" : "Escuro"}
              </button>

              <div className="h-px bg-border/50 my-1 mx-4" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} />
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
