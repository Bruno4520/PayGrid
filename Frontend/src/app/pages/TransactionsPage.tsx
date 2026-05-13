import { useState } from "react";
import { Plus } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import {
  TransactionTable,
  type Transaction,
} from "../components/transactions/TransactionTable";
import { NewTransactionModal } from "../components/transactions/NewTransactionModal";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "05/06/2026",
    description: "Salário Mensal",
    category: "Receitas",
    account: "Conta Corrente Itaú",
    paymentMethod: "PIX",
    amount: 3500.0,
    type: "income",
    observation: "Salário referente a Maio/2026",
  },
  {
    id: "2",
    date: "05/06/2026",
    description: "Aluguel e Condomínio",
    category: "Moradia",
    account: "Conta Corrente Itaú",
    paymentMethod: "PIX",
    amount: 800.0,
    type: "expense",
  },
  {
    id: "3",
    date: "08/06/2026",
    description: "Supermercado Extra",
    category: "Alimentação",
    account: "Cartão Itaú Click",
    paymentMethod: "Crédito",
    amount: 450.9,
    type: "expense",
    observation: "Compra do mês",
  },
  {
    id: "4",
    date: "10/06/2026",
    description: "Conta de Luz (Enel)",
    category: "Contas",
    account: "Conta Corrente Itaú",
    paymentMethod: "Débito",
    amount: 140.0,
    type: "expense",
  },
  {
    id: "5",
    date: "12/06/2026",
    description: "Freelance Landing Page",
    category: "Receitas",
    account: "Poupança Bradesco",
    paymentMethod: "PIX",
    amount: 700.0,
    type: "income",
    observation: "Cliente: Agência XPTO",
  },
  {
    id: "6",
    date: "12/06/2026",
    description: "Internet (Claro)",
    category: "Contas",
    account: "Cartão Nubank",
    paymentMethod: "Crédito",
    amount: 110.0,
    type: "expense",
  },
  {
    id: "7",
    date: "15/06/2026",
    description: "Uber (Trabalho)",
    category: "Transporte",
    account: "Cartão Nubank",
    paymentMethod: "Crédito",
    amount: 45.0,
    type: "expense",
  },
  {
    id: "8",
    date: "18/06/2026",
    description: "Posto Ipiranga",
    category: "Transporte",
    account: "Conta Corrente Itaú",
    paymentMethod: "Débito",
    amount: 75.0,
    type: "expense",
  },
  {
    id: "9",
    date: "20/06/2026",
    description: "Netflix",
    category: "Lazer",
    account: "Cartão Nubank",
    paymentMethod: "Crédito",
    amount: 39.9,
    type: "expense",
  },
  {
    id: "10",
    date: "22/06/2026",
    description: "iFood (Pizza)",
    category: "Lazer",
    account: "Cartão Itaú Click",
    paymentMethod: "Crédito",
    amount: 89.2,
    type: "expense",
  },
];

export function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilter = () => console.log("Aplicar filtros");
  const handleAddTransaction = () => setIsModalOpen(true);
  const handleSaveTransaction = (data: any) => {
    console.log("Nova transação salva:", data);
    setIsModalOpen(false);
  };
  const handleEdit = (id: string) => console.log("Editar transação:", id);
  const handleDelete = (id: string) => console.log("Excluir transação:", id);

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Cabeçalho da Página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Transações
            </h1>
            <p className="text-muted-foreground font-medium">
              Gerencie suas receitas e despesas
            </p>
          </div>

          {/* Filtros */}
          <TransactionFilters onFilter={handleFilter} />

          {/* Botões de Ação */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddTransaction}
              className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              <Plus size={20} />
              Nova Transação
            </button>
          </div>

          {/* Tabela de Transações */}
          <TransactionTable
            transactions={mockTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>

        <Footer />
      </div>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
