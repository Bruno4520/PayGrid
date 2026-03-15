import { useState } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { CreditCardItem } from "../components/cards/CreditCardItem";
import { CardDetails } from "../components/cards/CardDetails";
import {
  RecentPurchases,
  type Purchase,
} from "../components/cards/RecentPurchases";
import { Plus } from "lucide-react";

const creditCards = [
  {
    id: "1",
    label: "Cartão Principal",
    bank: "Nubank",
    availableLimit: 4250.0,
    totalLimit: 6000.0,
    cardNumber: "**** **** **** 1234",
    color: "purple" as const,
    closingDay: 15,
    dueDay: 10,
  },
  {
    id: "2",
    label: "Cartão Secundário",
    bank: "Itaú",
    availableLimit: 1800.0,
    totalLimit: 3000.0,
    cardNumber: "**** **** **** 5678",
    color: "orange" as const,
    closingDay: 20,
    dueDay: 5,
  },
  {
    id: "3",
    label: "Cartão Empresarial",
    bank: "Bradesco",
    availableLimit: 8500.0,
    totalLimit: 15000.0,
    cardNumber: "**** **** **** 9012",
    color: "red" as const,
    closingDay: 10,
    dueDay: 25,
  },
];

const mockPurchases: Purchase[] = [
  {
    id: "1",
    merchant: "Amazon",
    date: "Hoje",
    time: "14:30",
    amount: 89.9,
    category: "Eletrônicos",
    icon: "shopping",
  },
  {
    id: "2",
    merchant: "Posto Ipiranga",
    date: "Ontem",
    time: "08:15",
    amount: 120.0,
    category: "Combustível",
    icon: "fuel",
  },
  {
    id: "3",
    merchant: "iFood",
    date: "02/01",
    time: "19:45",
    amount: 45.8,
    category: "Alimentação",
    icon: "food",
  },
  {
    id: "4",
    merchant: "Spotify",
    date: "01/01",
    time: "10:00",
    amount: 19.9,
    category: "Assinatura",
    icon: "music",
  },
];

export function CardsPage() {
  const [selectedCardId, setSelectedCardId] = useState("1");

  const selectedCard =
    creditCards.find((card) => card.id === selectedCardId) || creditCards[0];

  const handleNewPurchase = () => {
    console.log("Nova compra");
  };

  const handleNewCard = () => {
    console.log("Novo Cartão");
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
                Meus Cartões
              </h1>
              <p className="text-gray-600">Gerencie seus cartões de crédito</p>
            </div>
            <button
              onClick={handleNewCard}
              className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3 rounded-lg hover:bg-[#1e4594] transition-colors"
            >
              <Plus size={18} />
              Novo Cartão
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Credit Cards */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Seus Cartões
              </h2>
              <div className="space-y-4">
                {creditCards.map((card) => (
                  <CreditCardItem
                    key={card.id}
                    label={card.label}
                    bank={card.bank}
                    availableLimit={card.availableLimit}
                    cardNumber={card.cardNumber}
                    color={card.color}
                    isSelected={selectedCardId === card.id}
                    onClick={() => setSelectedCardId(card.id)}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Card Details & Purchases */}
            <div className="lg:col-span-2 space-y-6">
              <CardDetails
                totalLimit={selectedCard.totalLimit}
                available={selectedCard.availableLimit}
                closingDay={selectedCard.closingDay}
                dueDay={selectedCard.dueDay}
                onNewPurchase={handleNewPurchase}
              />

              <RecentPurchases purchases={mockPurchases} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
