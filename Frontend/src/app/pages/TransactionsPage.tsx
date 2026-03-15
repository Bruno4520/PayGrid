import { Plus } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import {
  TransactionTable,
  type Transaction,
} from "../components/transactions/TransactionTable";

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "15/12/2026",
    description: "Salário Dezembro",
    category: "Salário",
    account: "Conta Corrente",
    paymentMethod: "PIX",
    amount: 5500.0,
    type: "income",
    observation: "Recebido no dia 15, como de costume",
  },
  {
    id: "2",
    date: "14/12/2026",
    description: "Supermercado Extra",
    category: "Alimentação",
    account: "Cartão Crédito",
    paymentMethod: "Crédito",
    amount: 245.8,
    type: "expense",
    observation: "Compra mensal de mantimentos",
  },
  {
    id: "3",
    date: "13/12/2026",
    description: "Combustível Posto Shell",
    category: "Transporte",
    account: "Conta Corrente",
    paymentMethod: "Débito",
    amount: 120.0,
    type: "expense",
    observation: "Abastecimento do carro",
  },
  {
    id: "4",
    date: "12/12/2026",
    description: "Freelance Design",
    category: "Renda Extra",
    account: "Conta Corrente",
    paymentMethod: "PIX",
    amount: 800.0,
    type: "income",
    observation: "Projeto de design gráfico para cliente",
  },
  {
    id: "5",
    date: "11/12/2026",
    description: "Aluguel Apartamento",
    category: "Casa",
    account: "Conta Corrente",
    paymentMethod: "PIX",
    amount: 1200.0,
    type: "expense",
    observation: "",
  },
  {
    id: "6",
    date: "10/12/2026",
    description: "Netflix Assinatura",
    category: "Entretenimento",
    account: "Cartão Crédito",
    paymentMethod: "Crédito",
    amount: 45.9,
    type: "expense",
    observation: "",
  },
];

export function TransactionsPage() {
  const handleFilter = () => {
    console.log("Aplicar filtros");
  };

  const handleAddTransaction = () => {
    console.log("Adicionar Transacção");
  };

  const handleEdit = (id: string) => {
    console.log("Editar transação:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Excluir transação:", id);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Transações
            </h1>
            <p className="text-gray-600">Gerencie suas receitas e despesas</p>
          </div>

          {/* Filters */}
          <TransactionFilters onFilter={handleFilter} />

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddTransaction}
              className="inline-flex items-center gap-2 bg-[#2B5BBA] text-white px-6 py-3 rounded-lg hover:bg-[#1e4594] transition-colors"
            >
              <Plus size={18} />
              Nova Transação
            </button>
          </div>

          {/* Transactions Table */}
          <TransactionTable
            transactions={mockTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}
