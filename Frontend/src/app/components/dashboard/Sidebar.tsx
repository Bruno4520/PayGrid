import {
  LayoutDashboard,
  ArrowLeftRight,
  Building2,
  CreditCard,
  FileText,
  PieChart,
  Calculator,
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
        isActive
          ? "bg-[#2B5BBA] text-white shadow-md shadow-blue-900/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col shrink-0 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3 mb-2 mt-2">
        <div className="w-10 h-10 bg-[#2B5BBA] rounded-xl flex items-center justify-center shadow-lg">
          <svg
            width="24"
            height="24"
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          PayGrid
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
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
