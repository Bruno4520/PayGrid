import { Plus } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { AccountCard } from "../components/accounts/AccountCard";
import {
  AccountsTable,
  type Account,
} from "../components/accounts/AccountsTable";

// Mock data
const summaryAccounts = [
  {
    type: "checking" as const,
    name: "Conta Corrente",
    balance: 12450.0,
    badge: "Principal",
    details: "Banco Itaú • Ag 1234",
    isPrimary: true,
  },
  {
    type: "savings" as const,
    name: "Poupança",
    balance: 8320.5,
    badge: "Ativa",
    details: "Banco Bradesco • Ag 5678",
  },
  {
    type: "wallet" as const,
    name: "Carteira",
    balance: 540.0,
    badge: "Ativa",
    details: "Dinheiro em espécie",
  },
];

const accountsList: Account[] = [
  {
    id: "1",
    name: "Conta Corrente Itaú",
    details: "Ag 1234 • Cc 12345-8",
    type: "checking",
    typeName: "Corrente",
    balance: 12450.0,
    icon: "building",
  },
  {
    id: "2",
    name: "Poupança Bradesco",
    details: "Ag 5678 • Pp 88765-4",
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
    name: "Conta Santander",
    details: "Ag 9012 • Cc 54321-0",
    type: "checking",
    typeName: "Corrente",
    balance: 3890.75,
    icon: "building",
  },
  {
    id: "5",
    name: "Conta Nubank",
    details: "Ag 0001 • Cc 67890-2",
    type: "checking",
    typeName: "Corrente",
    balance: 5672.3,
    icon: "building",
  },
];

export function AccountsPage() {
  const handleAddAccount = () => {
    console.log("Adicionar conta");
  };

  const handleEdit = (id: string) => {
    console.log("Editar conta:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Excluir conta:", id);
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
                Contas
              </h1>
              <p className="text-gray-600">
                Gerencie suas contas bancárias e carteiras
              </p>
            </div>
            <button
              onClick={handleAddAccount}
              className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3 rounded-lg hover:bg-[#1e4594] transition-colors"
            >
              <Plus size={18} />
              Adicionar Conta
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {summaryAccounts.map((account, index) => (
              <AccountCard key={index} {...account} />
            ))}
          </div>

          {/* Accounts Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
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
    </div>
  );
}
