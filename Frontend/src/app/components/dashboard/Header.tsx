import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  LogOut,
  AlertTriangle,
  AlertCircle,
  Menu,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  Building2,
  CreditCard,
  FileText,
  PieChart,
  Calculator,
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
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const userName = user?.nome || "Usuário";
  const initial = userName.charAt(0).toUpperCase();

  const menuItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/transacoes",
      icon: <ArrowLeftRight size={20} />,
      label: "Transações",
    },
    { to: "/contas", icon: <Building2 size={20} />, label: "Contas" },
    { to: "/cartoes", icon: <CreditCard size={20} />, label: "Cartões" },
    { to: "/faturas", icon: <FileText size={20} />, label: "Faturas" },
    { to: "/orcamentos", icon: <PieChart size={20} />, label: "Orçamentos" },
    { to: "/relatorios", icon: <PieChart size={20} />, label: "Relatórios" },
    { to: "/simulador", icon: <Calculator size={20} />, label: "Simulador" },
  ];

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <>
      <header className="h-20 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 transition-colors duration-300 sticky top-0 z-30">
        <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="relative w-full">
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

        <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-4">
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
              <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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
              className="flex items-center gap-3 p-1.5 md:pr-3 hover:bg-muted rounded-2xl transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#2B5BBA] to-[#4C7FEE] text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
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
                <div className="p-4 border-b border-border/50 bg-muted/30 block md:hidden">
                  <p className="text-sm font-bold text-foreground">
                    {userName}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Conta Pessoal
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

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-[280px] max-w-[80vw] bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#2B5BBA] rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 13L6 10L10 14L18 6L21 9"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 20H21"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  PayGrid
                </h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground p-2 bg-muted/50 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold ${
                      isActive
                        ? "bg-[#2B5BBA] text-white shadow-md shadow-blue-900/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
