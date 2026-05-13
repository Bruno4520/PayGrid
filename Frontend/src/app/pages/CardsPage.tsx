import { useState } from "react";
import { Plus } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { CreditCardItem } from "../components/cards/CreditCardItem";
import { CardDetails } from "../components/cards/CardDetails";
import { RecentPurchases } from "../components/cards/RecentPurchases";
import { NewCardModal } from "../components/cards/NewCardModal";
import { NewTransactionModal } from "../components/transactions/NewTransactionModal";

const mockCards = [
  {
    id: "1",
    name: "Itaú Click",
    brand: "Mastercard",
    lastDigits: "4582",
    limit: 3000,
    usedLimit: 1000.0,
    closingDay: 5,
    dueDay: 12,
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "2",
    name: "Nubank Ultravioleta",
    brand: "Mastercard",
    lastDigits: "8892",
    limit: 2500,
    usedLimit: 1000.0,
    closingDay: 28,
    dueDay: 5,
    color: "from-purple-600 to-purple-800",
  },
];

export function CardsPage() {
  const [selectedCardId, setSelectedCardId] = useState(mockCards[0].id);

  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const selectedCard =
    mockCards.find((c) => c.id === selectedCardId) || mockCards[0];

  const handleNewPurchase = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsTransactionModalOpen(true);
  };

  const handleEditPurchase = (purchaseId: string) => {
    console.log("Editar compra ID:", purchaseId);
  };

  const handleDeletePurchase = (purchaseId: string) => {
    console.log("Excluir compra ID:", purchaseId);
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                Meus Cartões
              </h1>
              <p className="text-muted-foreground font-medium">
                Gerencie seus limites e faturas
              </p>
            </div>
            <button
              onClick={() => setIsNewCardModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3.5 rounded-xl hover:opacity-90 font-medium transition-opacity shadow-sm"
            >
              <Plus size={20} />
              Novo Cartão
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Selecione o Cartão
              </h2>
              {mockCards.map((card) => (
                <CreditCardItem
                  key={card.id}
                  {...card}
                  isActive={selectedCardId === card.id}
                  onClick={() => setSelectedCardId(card.id)}
                />
              ))}
            </div>

            <div className="lg:col-span-8 space-y-6">
              <CardDetails card={selectedCard} />
              <RecentPurchases
                cardId={selectedCard.id}
                onNewPurchase={handleNewPurchase}
                onEditPurchase={handleEditPurchase}
                onDeletePurchase={handleDeletePurchase}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Modal de Novo Cartão */}
      <NewCardModal
        isOpen={isNewCardModalOpen}
        onClose={() => setIsNewCardModalOpen(false)}
        onSave={(data) => console.log("Salvar Cartão (Prisma):", data)}
      />

      {/* Modal de Nova Transação */}
      <NewTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        initialType="despesa"
        initialPaymentMethod="cartao"
        initialCardId={selectedCard.id}
        onSave={(data) => console.log("Salvar Compra no Cartão:", data)}
      />
    </div>
  );
}
