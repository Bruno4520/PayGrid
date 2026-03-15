import {
  LayoutDashboard,
  ArrowLeftRight,
  Building2,
  CreditCard,
  FileText,
  Target,
  BarChart3,
  Calculator,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function SidebarItem({ to, icon, label, isActive }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        isActive
          ? "bg-[#2B5BBA] text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      to: "/transacoes",
      icon: <ArrowLeftRight size={18} />,
      label: "Transações",
    },
    { to: "/contas", icon: <Building2 size={18} />, label: "Contas" },
    { to: "/cartoes", icon: <CreditCard size={18} />, label: "Cartões" },
    { to: "/faturas", icon: <FileText size={18} />, label: "Faturas" },
    { to: "/orcamentos", icon: <Target size={18} />, label: "Orçamentos" },
    { to: "/relatorios", icon: <BarChart3 size={18} />, label: "Relatórios" },
    { to: "/simulador", icon: <Calculator size={18} />, label: "Simulador" },
  ];

  return (
    <aside className="w-48 bg-[#1a1a2e] min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#2B5BBA] rounded-lg flex items-center justify-center">
          <svg
            width="20"
            height="20"
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
        <h1 className="text-xl font-semibold text-white">PayGrid</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.to}
          />
        ))}
      </nav>
    </aside>
  );
}
