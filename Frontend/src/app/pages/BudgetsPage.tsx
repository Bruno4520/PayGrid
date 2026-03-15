import { useState } from "react";
import { Plus } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { BudgetSummaryCard } from "../components/budgets/BudgetSummaryCard";
import { BudgetCategoryCard } from "../components/budgets/BudgetCategoryCard";
import { AddCategoryCard } from "../components/budgets/AddCategoryCard";

const budgetCategories = [
  {
    id: "1",
    category: "Moradia",
    icon: "home" as const,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    status: "within" as const,
    planned: 2500.0,
    spent: 2350.0,
  },
  {
    id: "2",
    category: "Alimentação",
    icon: "food" as const,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    status: "exceeded" as const,
    planned: 1200.0,
    spent: 1347.5,
  },
  {
    id: "3",
    category: "Transporte",
    icon: "car" as const,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    status: "within" as const,
    planned: 800.0,
    spent: 650.0,
  },
  {
    id: "4",
    category: "Saúde",
    icon: "health" as const,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    status: "within" as const,
    planned: 1500.0,
    spent: 900.0,
  },
  {
    id: "5",
    category: "Lazer",
    icon: "game" as const,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-50",
    status: "within" as const,
    planned: 2500.0,
    spent: 1600.0,
  },
];

export function BudgetsPage() {
  const [selectedMonth, setSelectedMonth] = useState("Janeiro 2026");

  const totalPlanned = budgetCategories.reduce(
    (sum, cat) => sum + cat.planned,
    0,
  );
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const available = totalPlanned - totalSpent;

  const handleAddBudget = () => {
    console.log("Adicionar orçamento");
  };

  const handleAddCategory = () => {
    console.log("Adicionar categoria");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Orçamentos
              </h1>
              <p className="text-gray-600">
                Defina e acompanhe seus orçamentos mensais por categoria
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
              >
                <option>Janeiro 2026</option>
                <option>Fevereiro 2026</option>
                <option>Março 2026</option>
                <option>Abril 2026</option>
                <option>Maio 2026</option>
                <option>Junho 2026</option>
              </select>
              <button
                onClick={handleAddBudget}
                className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3 rounded-lg hover:bg-[#1e4594] transition-colors"
              >
                <Plus size={18} />
                Adicionar Orçamento
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <BudgetSummaryCard type="planned" value={totalPlanned} />
            <BudgetSummaryCard type="spent" value={totalSpent} />
            <BudgetSummaryCard type="available" value={available} />
          </div>

          {/* Budget Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetCategories.map((budget) => (
              <BudgetCategoryCard
                key={budget.id}
                category={budget.category}
                icon={budget.icon}
                iconColor={budget.iconColor}
                iconBg={budget.iconBg}
                status={budget.status}
                planned={budget.planned}
                spent={budget.spent}
              />
            ))}

            <AddCategoryCard onClick={handleAddCategory} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
