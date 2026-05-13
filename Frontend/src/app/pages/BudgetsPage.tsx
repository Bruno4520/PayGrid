import { useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { BudgetSummaryCard } from "../components/budgets/BudgetSummaryCard";
import { BudgetCategoryCard } from "../components/budgets/BudgetCategoryCard";
import {
  NewBudgetModal,
  type BudgetData,
} from "../components/budgets/NewBudgetModal";
import { CategoryModal } from "../components/budgets/NewCategoryModal";

const mockCategories = [
  {
    id: "c1",
    nome: "Moradia",
    icone: "home",
    cor: "bg-blue-500",
    isSystem: true,
  },
  {
    id: "c2",
    nome: "Alimentação",
    icone: "food",
    cor: "bg-emerald-500",
    isSystem: true,
  },
  {
    id: "c3",
    nome: "Transporte",
    icone: "car",
    cor: "bg-purple-500",
    isSystem: true,
  },
  {
    id: "c4",
    nome: "Saúde",
    icone: "health",
    cor: "bg-red-500",
    isSystem: true,
  },
  {
    id: "c5",
    nome: "Lazer",
    icone: "game",
    cor: "bg-yellow-500",
    isSystem: false,
  },
  {
    id: "c6",
    nome: "Compras",
    icone: "shopping",
    cor: "bg-pink-500",
    isSystem: false,
  },
];

const mockBudgets = [
  { categoriaId: "c1", planned: 2500, spent: 2350 },
  { categoriaId: "c2", planned: 1200, spent: 1347.5 },
  { categoriaId: "c3", planned: 800, spent: 650 },
];

export function BudgetsPage() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedCategoryIdForBudget, setSelectedCategoryIdForBudget] =
    useState("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryData, setEditingCategoryData] = useState<any>(null);

  const totalPlanned = mockBudgets.reduce((sum, b) => sum + b.planned, 0);
  const totalSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0);
  const available = totalPlanned - totalSpent;

  const handleOpenSetBudget = (categoryId: string) => {
    setSelectedCategoryIdForBudget(categoryId);
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = (data: BudgetData) => {
    console.log("Salvar Orçamento no Prisma:", data);
  };

  const handleNewCategory = () => {
    setEditingCategoryData(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (categoryId: string) => {
    const categoryToEdit = mockCategories.find((c) => c.id === categoryId);
    setEditingCategoryData(categoryToEdit);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    console.log("Excluir Categoria do Prisma, ID:", categoryId);
  };

  const handleSaveCategory = (data: any) => {
    console.log("Salvar Categoria no Prisma:", data);
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                Controle de Gastos
              </h1>
              <p className="text-muted-foreground font-medium">
                Gira as suas categorias e limites de orçamento mensais
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-3 bg-card border border-border/50 rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all shadow-sm"
              />
              <button
                onClick={handleNewCategory}
                className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-5 py-3 rounded-xl hover:opacity-90 font-bold transition-opacity shadow-sm"
              >
                Nova Categoria
              </button>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <BudgetSummaryCard type="planned" value={totalPlanned} />
            <BudgetSummaryCard type="spent" value={totalSpent} />
            <BudgetSummaryCard type="available" value={available} />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-6">
            As Suas Categorias
          </h2>

          {/* Grid de Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
            {mockCategories.map((cat) => {
              const budget = mockBudgets.find((b) => b.categoriaId === cat.id);

              return (
                <BudgetCategoryCard
                  key={cat.id}
                  categoryId={cat.id}
                  category={cat.nome}
                  icon={cat.icone}
                  color={cat.cor}
                  planned={budget?.planned}
                  spent={budget?.spent}
                  isSystemCategory={cat.isSystem}
                  onSetBudget={() => handleOpenSetBudget(cat.id)}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              );
            })}
          </div>
        </main>
        <Footer />
      </div>

      {/* Modais da Página */}
      <NewBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        initialCategoryId={selectedCategoryIdForBudget}
        onSave={handleSaveBudget}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        initialData={editingCategoryData}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
