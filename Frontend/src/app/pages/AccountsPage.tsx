import { useState } from "react";
import { Plus } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { AccountCard } from "../components/accounts/AccountCard";
import {
  AccountsTable,
  type Account,
} from "../components/accounts/AccountsTable";
import {
  NewAccountModal,
  type AccountData,
} from "../components/accounts/NewAccountModal";

const summaryAccounts = [
  {
    type: "checking" as const,
    name: "Conta Corrente Itaú",
    balance: 1250.0,
    badge: "Principal",
    details: "Ag: 1234 • Cc: 12345-8",
    isPrimary: true,
  },
  {
    type: "savings" as const,
    name: "Poupança Bradesco",
    balance: 1000.0,
    badge: "Ativa",
    details: "Ag: 5678 • Cc: 88765-4",
  },
  {
    type: "wallet" as const,
    name: "Carteira Física",
    balance: 200.0,
    badge: "Ativa",
    details: "Dinheiro em espécie",
  },
];

const accountsList: Account[] = [
  {
    id: "1",
    name: "Conta Corrente Itaú",
    details: "Ag: 1234 • Cc: 12345-8",
    type: "checking",
    typeName: "Corrente",
    balance: 12450.0,
    icon: "building",
  },
  {
    id: "2",
    name: "Poupança Bradesco",
    details: "Ag: 5678 • Pp: 88765-4",
    type: "savings",
    typeName: "Poupança",
    balance: 8320.5,
    icon: "sprout",
  },
  {
    id: "3",
    name: "Carteira Pessoal",
    details: "Dinheiro físico",
    type: "wallet",
    typeName: "Carteira",
    balance: 540.0,
    icon: "wallet",
  },
  {
    id: "4",
    name: "Conta Nubank",
    details: "Ag: 0001 • Cc: 67890-2",
    type: "checking",
    typeName: "Corrente",
    balance: 5672.3,
    icon: "building",
  },
];

export function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAccount = () => setIsModalOpen(true);
  const handleEdit = (id: string) => console.log("Editar conta:", id);
  const handleDelete = (id: string) => console.log("Excluir conta:", id);

  const handleSaveAccount = (data: AccountData) => {
    console.log("Payload para enviar ao backend (Prisma):", data);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Cabeçalho da Página */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                Contas
              </h1>
              <p className="text-muted-foreground font-medium">
                Gerencie suas contas bancárias e carteiras
              </p>
            </div>
            <button
              onClick={handleAddAccount}
              className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3.5 rounded-xl hover:opacity-90 font-medium transition-opacity shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              <Plus size={20} />
              Adicionar Conta
            </button>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {summaryAccounts.map((account, index) => (
              <AccountCard key={index} {...account} />
            ))}
          </div>

          {/* Tabela de Contas */}
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">
              Detalhes das Contas
            </h2>
            <AccountsTable
              accounts={accountsList}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
        <Footer />
      </div>

      <NewAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccount}
      />
    </div>
  );
}
