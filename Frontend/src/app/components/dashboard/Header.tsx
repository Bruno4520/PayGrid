import { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({
  userName = "João Silva",
  userRole = "Administrador",
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between transition-colors duration-300 relative z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar transações, contas..."
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </button>

        {/* User Info & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-4 border-l border-border hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B5BBA] to-[#4C7FEE] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {userName.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground font-medium">
                {userRole}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-muted-foreground transition-transform duration-200 ml-1 hidden lg:block ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-4 w-56 bg-card border border-border/50 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Mostra info do usuário no mobile dentro do menu */}
              <div className="px-4 py-3 border-b border-border/50 mb-2 lg:hidden">
                <p className="text-sm font-bold text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  {userRole}
                </p>
              </div>

              {/* Opções */}
              <a
                href="/configuracoes"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Settings size={18} />
                Meu Perfil
              </a>

              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                Tema {isDarkMode ? "Claro" : "Escuro"}
              </button>

              <div className="h-px bg-border/50 my-2 mx-4" />

              <button
                onClick={() => console.log("Sair da conta")}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} />
                Sair da Conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
