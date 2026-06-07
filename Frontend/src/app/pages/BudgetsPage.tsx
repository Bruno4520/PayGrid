import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { BudgetSummaryCard } from "../components/budgets/BudgetSummaryCard";
import { BudgetCategoryCard } from "../components/budgets/BudgetCategoryCard";
import {
  CategoryModal,
  type CategoryInitialData,
  type CategorySavePayload,
} from "../components/budgets/NewCategoryModal";
import { api } from "../../services/api";

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export interface BudgetItem {
  categoria: {
    id: number;
    nome: string;
    icone: string | null;
    cor: string | null;
    descricao: string | null;
    sistema: boolean;
  };
  orcamento: {
    valorPlanejado: number;
  } | null;
  gastoAtual: number;
}

export function BudgetsPage() {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { mes: now.getMonth() + 1, ano: now.getFullYear() };
  });

  const [budgetsData, setBudgetData] = useState<BudgetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] =
    useState<CategoryInitialData | null>(null);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<BudgetItem[]>(
        `/orcamentos?mes=${currentDate.mes}&ano=${currentDate.ano}`,
      );
      setBudgetData(res.data);
    } catch (error) {
      toast.error("Erro ao carregar os orçamentos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const totalPlanned = budgetsData.reduce(
    (sum, item) => sum + (item.orcamento?.valorPlanejado || 0),
    0,
  );

  const totalSpent = budgetsData.reduce((sum, item) => {
    if (item.orcamento && item.orcamento.valorPlanejado > 0) {
      return sum + item.gastoAtual;
    }
    return sum;
  }, 0);

  const available = totalPlanned - totalSpent;

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      let m = prev.mes - 1;
      let a = prev.ano;
      if (m < 1) {
        m = 12;
        a -= 1;
      }
      return { mes: m, ano: a };
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      let m = prev.mes + 1;
      let a = prev.ano;
      if (m > 12) {
        m = 1;
        a += 1;
      }
      return { mes: m, ano: a };
    });
  };

  const handleNewCategory = () => {
    setModalInitialData(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenConfigureCategory = (categoryIdStr: string) => {
    const item = budgetsData.find(
      (b) => String(b.categoria.id) === categoryIdStr,
    );
    if (!item) return;

    setModalInitialData({
      id: item.categoria.id,
      nome: item.categoria.nome,
      icone: item.categoria.icone || "other",
      cor: item.categoria.cor || "bg-blue-500",
      descricao: item.categoria.descricao || "",
      isSystem: item.categoria.sistema,
      plannedBudget: item.orcamento ? item.orcamento.valorPlanejado : 0,
    });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (categoryIdStr: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta categoria do sistema? As suas transações antigas não serão apagadas, mas ficarão 'Sem categoria'.",
      )
    ) {
      try {
        await api.delete(`/categorias/${categoryIdStr}`);
        toast.success("Categoria excluída com sucesso.");
        fetchBudgets();
      } catch (error) {
        const message =
          isAxiosError(error) && error.response?.data?.mensagem
            ? error.response.data.mensagem
            : "Erro ao excluir categoria.";
        toast.error(message);
      }
    }
  };

  const handleSaveCategoryAndBudget = async (data: CategorySavePayload) => {
    try {
      let categoryId = modalInitialData?.id;

      if (!modalInitialData?.isSystem) {
        if (categoryId) {
          await api.put(`/categorias/${categoryId}`, {
            nome: data.nome,
            descricao: data.descricao,
            icone: data.icone,
            cor: data.cor,
          });
        } else {
          const res = await api.post(`/categorias`, {
            nome: data.nome,
            descricao: data.descricao,
            icone: data.icone,
            cor: data.cor,
          });
          categoryId = res.data.id;
        }
      }

      if (data.plannedBudget > 0) {
        await api.post(`/orcamentos`, {
          categoriaId: categoryId,
          valorPlanejado: data.plannedBudget,
          mes: currentDate.mes,
          ano: currentDate.ano,
        });
      } else if (categoryId) {
        await api.delete(
          `/orcamentos/${categoryId}/${currentDate.mes}/${currentDate.ano}`,
        );
      }

      toast.success("Dados guardados com sucesso.");
      fetchBudgets();
      setIsCategoryModalOpen(false);
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Erro ao salvar informações.";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                Orçamentos
              </h1>
              <p className="text-muted-foreground font-medium">
                Controle de gastos: defina e acompanhe os seus limites mensais
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center bg-card border border-border/50 rounded-xl p-1 shadow-sm">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="min-w-[140px] text-center font-bold text-foreground tracking-wide">
                  {MONTH_NAMES[currentDate.mes - 1]} {currentDate.ano}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <button
                onClick={handleNewCategory}
                className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-5 py-2.5 rounded-xl hover:opacity-90 font-bold transition-opacity shadow-sm"
              >
                Nova Categoria
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <BudgetSummaryCard type="planned" value={totalPlanned} />
            <BudgetSummaryCard type="spent" value={totalSpent} />
            <BudgetSummaryCard type="available" value={available} />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-6">
            As Suas Categorias e Limites
          </h2>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground animate-pulse font-medium">
              A carregar orçamentos...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
              {budgetsData.map((item) => (
                <BudgetCategoryCard
                  key={item.categoria.id}
                  categoryId={String(item.categoria.id)}
                  category={item.categoria.nome}
                  icon={item.categoria.icone || "other"}
                  color={item.categoria.cor || "bg-zinc-500"}
                  planned={item.orcamento?.valorPlanejado}
                  spent={item.gastoAtual}
                  isSystemCategory={item.categoria.sistema}
                  onSetBudget={() =>
                    handleOpenConfigureCategory(String(item.categoria.id))
                  }
                  onEditCategory={handleOpenConfigureCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              ))}
              {budgetsData.length === 0 && (
                <div className="col-span-full text-center py-12 bg-card border border-border/50 rounded-3xl">
                  <p className="text-muted-foreground font-medium mb-4">
                    Você ainda não tem categorias criadas.
                  </p>
                  <button
                    onClick={handleNewCategory}
                    className="text-[#2B5BBA] font-bold hover:underline"
                  >
                    Criar a primeira categoria
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        initialData={modalInitialData}
        onSave={handleSaveCategoryAndBudget}
      />
    </div>
  );
}
