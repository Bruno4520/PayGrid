import { useState, useEffect } from "react";
import {
  Plus,
  CreditCard,
  Edit2,
  Trash2,
  GripHorizontal,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import {
  CreditCardItem,
  type CardItemData,
} from "../components/cards/CreditCardItem";
import { CardDetails } from "../components/cards/CardDetails";
import { RecentPurchases } from "../components/cards/RecentPurchases";
import { NewCardModal } from "../components/cards/NewCardModal";
import { NewTransactionModal } from "../components/transactions/NewTransactionModal";
import { api } from "../../services/api";
import type { Transaction } from "../components/transactions/TransactionTable";

const getCardStyle = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("nubank")) return "from-purple-600 to-purple-800";
  if (normalized.includes("itaú") || normalized.includes("itau"))
    return "from-orange-500 to-orange-600";
  if (normalized.includes("bradesco") || normalized.includes("santander"))
    return "from-red-600 to-red-800";
  if (normalized.includes("c6")) return "from-zinc-800 to-black";
  if (normalized.includes("inter")) return "from-orange-400 to-orange-500";
  if (normalized.includes("caixa")) return "from-cyan-600 to-blue-700";
  if (normalized.includes("bb") || normalized.includes("brasil"))
    return "from-yellow-400 to-yellow-600";
  return "from-blue-600 to-blue-800";
};

export function CardsPage() {
  const [cards, setCards] = useState<CardItemData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [cardToEdit, setCardToEdit] = useState<CardItemData | null>(null);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [deletingPurchaseId, setDeletingPurchaseId] = useState<number | null>(
    null,
  );

  const fetchCardsAndTransactions = async () => {
    try {
      setLoading(true);
      const [cardsResponse, transactionsResponse] = await Promise.all([
        api.get("/cartoes"),
        api.get("/transacoes"),
      ]);

      const adaptedCards: CardItemData[] = cardsResponse.data.map(
        (card: any) => ({
          id: String(card.id),
          name: card.nome,
          lastDigits: card.ultimosDigitos || "0000",
          limit: card.limite,
          usedLimit: card.usedLimit || 0,
          closingDay: card.diaFechamentoFatura,
          dueDay: card.diaVencimentoFatura,
          color: getCardStyle(card.nome),
        }),
      );

      const savedOrder = JSON.parse(
        localStorage.getItem("@financas:cardsOrder") || "[]",
      );
      if (savedOrder.length > 0) {
        adaptedCards.sort((a, b) => {
          const idxA = savedOrder.indexOf(a.id);
          const idxB = savedOrder.indexOf(b.id);
          return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
        });
      }

      setCards(adaptedCards);
      setTransactions(transactionsResponse.data);

      if (
        adaptedCards.length > 0 &&
        (!selectedCardId || !adaptedCards.find((c) => c.id === selectedCardId))
      ) {
        setSelectedCardId(adaptedCards[0].id);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados dos cartões.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardsAndTransactions();
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) return;

    const newCards = [...cards];
    const draggedItem = newCards.splice(draggedIdx, 1)[0];
    newCards.splice(dropIdx, 0, draggedItem);

    setCards(newCards);
    localStorage.setItem(
      "@financas:cardsOrder",
      JSON.stringify(newCards.map((c) => c.id)),
    );
    setDraggedIdx(null);
  };

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];
  const cardTransactions = transactions.filter(
    (t) => t.cartaoCreditoId === Number(selectedCard?.id),
  );

  const handleAddCardClick = () => {
    setCardToEdit(null);
    setIsNewCardModalOpen(true);
  };

  const handleEditCard = (card: CardItemData) => {
    setCardToEdit(card);
    setIsNewCardModalOpen(true);
  };

  const handleDeleteCard = async (id: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este cartão? Todas as faturas e compras vinculadas serão apagadas permanentemente.",
      )
    ) {
      setDeletingCardId(id);
      toast.info("A excluir o cartão e as faturas...");
      try {
        await api.delete(`/cartoes/${id}`);
        toast.success("Cartão excluído com sucesso.");
        if (selectedCardId === id) setSelectedCardId(null);
        fetchCardsAndTransactions();
      } catch (error) {
        const message =
          isAxiosError(error) && error.response?.data?.mensagem
            ? error.response.data.mensagem
            : "Não foi possível excluir o cartão.";
        toast.error(message);
      } finally {
        setDeletingCardId(null);
      }
    }
  };

  const handleSaveCard = async (data: any) => {
    try {
      if (cardToEdit) {
        await api.put(`/cartoes/${cardToEdit.id}`, data);
        toast.success("Cartão atualizado com sucesso.");
      } else {
        await api.post("/cartoes", data);
        toast.success("Cartão criado com sucesso.");
      }
      await fetchCardsAndTransactions();
      setIsNewCardModalOpen(false);
      setCardToEdit(null);
    } catch (error) {
      toast.error("Não foi possível salvar as informações do cartão.");
    }
  };

  const handleNewPurchase = (cardId: string) => {
    setSelectedCardId(cardId);
    setTransactionToEdit(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditPurchase = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleDeletePurchase = async (purchaseId: number) => {
    if (
      window.confirm("Tem certeza que deseja excluir esta compra do cartão?")
    ) {
      setDeletingPurchaseId(purchaseId);
      try {
        await api.delete(`/transacoes/${purchaseId}`);
        toast.success("Compra excluída.");
        fetchCardsAndTransactions();
      } catch (error) {
        toast.error("Erro ao excluir compra.");
      } finally {
        setDeletingPurchaseId(null);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                Meus Cartões
              </h1>
              <p className="text-muted-foreground font-medium">
                Gerencie os seus limites e faturas
              </p>
            </div>
            <button
              onClick={handleAddCardClick}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3.5 rounded-xl hover:opacity-90 font-medium transition-opacity shadow-sm disabled:opacity-50"
            >
              <Plus size={20} /> Novo Cartão
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground font-medium animate-pulse">
                Carregando os seus cartões...
              </p>
            </div>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-card rounded-3xl border border-border/50 p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <CreditCard size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                Nenhum cartão cadastrado
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Adicione o seu primeiro cartão de crédito para começar a
                acompanhar as suas faturas e limites.
              </p>
              <button
                onClick={handleAddCardClick}
                className="bg-[#2B5BBA] text-white px-6 py-3 rounded-xl font-medium"
              >
                Adicionar Cartão
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Selecione o Cartão
                </h2>
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={() => setDraggedIdx(null)}
                    className={`group relative cursor-grab active:cursor-grabbing transition-all duration-300 ${draggedIdx === index ? "opacity-40 scale-95" : "opacity-100"}`}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-md text-white p-1 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity z-10 shadow-sm">
                      <GripHorizontal size={16} />
                    </div>

                    <CreditCardItem
                      {...card}
                      isActive={selectedCardId === card.id}
                      onClick={() => setSelectedCardId(card.id)}
                    />
                  </div>
                ))}
              </div>

              <div className="lg:col-span-8 space-y-6">
                {selectedCard && (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-foreground">
                        Detalhes do Cartão
                      </h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCard(selectedCard)}
                          disabled={deletingCardId !== null}
                          className="p-2 text-muted-foreground hover:text-[#2B5BBA] hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Editar Cartão"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(selectedCard.id)}
                          disabled={deletingCardId !== null}
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Excluir Cartão"
                        >
                          {deletingCardId === selectedCard.id ? (
                            <Loader2
                              size={18}
                              className="animate-spin text-red-600"
                            />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div
                      className={`${deletingCardId === selectedCard.id ? "opacity-50" : ""}`}
                    >
                      <CardDetails card={selectedCard} />
                    </div>

                    <RecentPurchases
                      cardId={selectedCard.id}
                      purchases={cardTransactions}
                      deletingPurchaseId={deletingPurchaseId}
                      onNewPurchase={handleNewPurchase}
                      onEditPurchase={handleEditPurchase}
                      onDeletePurchase={handleDeletePurchase}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>

      <NewCardModal
        isOpen={isNewCardModalOpen}
        onClose={() => {
          setIsNewCardModalOpen(false);
          setCardToEdit(null);
        }}
        onSave={handleSaveCard}
        cardToEdit={cardToEdit}
      />

      {selectedCard && (
        <NewTransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => {
            setIsTransactionModalOpen(false);
            setTransactionToEdit(null);
          }}
          initialType="despesa"
          initialPaymentMethod="cartao"
          initialCardId={selectedCard.id}
          transactionToEdit={transactionToEdit}
          onSave={() => fetchCardsAndTransactions()}
        />
      )}
    </div>
  );
}
