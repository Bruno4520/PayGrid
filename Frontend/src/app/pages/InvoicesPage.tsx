import { useState } from "react";
import { Download } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { InvoiceCard } from "../components/invoices/InvoiceCard";
import {
  InvoiceTable,
  type InvoiceItem,
} from "../components/invoices/InvoiceTable";

const invoices = [
  {
    id: "1",
    month: "Janeiro",
    year: 2026,
    status: "paid" as const,
    dueDate: "15/02/2026",
    totalAmount: 2847.9,
    purchasesCount: 18,
  },
  {
    id: "2",
    month: "Fevereiro",
    year: 2026,
    status: "paid" as const,
    dueDate: "15/03/2026",
    totalAmount: 3125.45,
    purchasesCount: 22,
  },
  {
    id: "3",
    month: "Março",
    year: 2026,
    status: "closed" as const,
    dueDate: "15/04/2026",
    totalAmount: 1956.78,
    purchasesCount: 14,
  },
  {
    id: "4",
    month: "Abril",
    year: 2026,
    status: "open" as const,
    dueDate: "15/05/2026",
    totalAmount: 892.34,
    purchasesCount: 8,
  },
  {
    id: "5",
    month: "Dezembro",
    year: 2026,
    status: "paid" as const,
    dueDate: "15/01/2026",
    totalAmount: 4123.67,
    purchasesCount: 31,
  },
  {
    id: "6",
    month: "Novembro",
    year: 2026,
    status: "paid" as const,
    dueDate: "15/12/2026",
    totalAmount: 2345.89,
    purchasesCount: 19,
  },
];

const invoiceItems: InvoiceItem[] = [
  {
    id: "1",
    date: "02/01/2026",
    description: "Supermercado Extra",
    category: "Alimentação",
    categoryColor: "bg-green-50 text-green-700",
    installment: "À vista",
    amount: 287.45,
  },
  {
    id: "2",
    date: "05/01/2026",
    description: "Netflix",
    category: "Entretenimento",
    categoryColor: "bg-purple-50 text-purple-700",
    installment: "À vista",
    amount: 39.9,
  },
  {
    id: "3",
    date: "08/01/2026",
    description: "Posto Shell",
    category: "Combustível",
    categoryColor: "bg-blue-50 text-blue-700",
    installment: "À vista",
    amount: 156.78,
  },
  {
    id: "4",
    date: "12/01/2026",
    description: "Smartphone Samsung",
    category: "Eletrônicos",
    categoryColor: "bg-orange-50 text-orange-700",
    installment: "3/12",
    amount: 1299.99,
  },
  {
    id: "5",
    date: "15/01/2026",
    description: "Farmácia São Paulo",
    category: "Saúde",
    categoryColor: "bg-red-50 text-red-700",
    installment: "À vista",
    amount: 89.34,
  },
  {
    id: "6",
    date: "18/01/2026",
    description: "Restaurante Outback",
    category: "Restaurantes",
    categoryColor: "bg-yellow-50 text-yellow-700",
    installment: "À vista",
    amount: 234.67,
  },
];

export function InvoicesPage() {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("1");

  const selectedInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0];

  const handleExport = () => {
    console.log("Exportar fatura");
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
                Faturas
              </h1>
              <p className="text-gray-600">
                Acompanhe o histórico e status das suas faturas
              </p>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              Exportar
            </button>
          </div>

          {/* Invoices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {invoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                month={invoice.month}
                year={invoice.year}
                status={invoice.status}
                dueDate={invoice.dueDate}
                totalAmount={invoice.totalAmount}
                purchasesCount={invoice.purchasesCount}
                onClick={() => setSelectedInvoiceId(invoice.id)}
              />
            ))}
          </div>

          {/* Invoice Details Table */}
          <InvoiceTable
            month={selectedInvoice.month}
            year={selectedInvoice.year}
            items={invoiceItems}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}
