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
    year: 2025,
    status: "paid" as const,
    dueDate: "15/01/2026",
    totalAmount: 4123.67,
    purchasesCount: 31,
  },
  {
    id: "6",
    month: "Novembro",
    year: 2025,
    status: "paid" as const,
    dueDate: "15/12/2025",
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
    categoryColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    installment: "À vista",
    amount: 287.45,
  },
  {
    id: "2",
    date: "05/01/2026",
    description: "Netflix",
    category: "Entretenimento",
    categoryColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    installment: "À vista",
    amount: 39.9,
  },
  {
    id: "3",
    date: "08/01/2026",
    description: "Posto Shell",
    category: "Combustível",
    categoryColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    installment: "À vista",
    amount: 156.78,
  },
  {
    id: "4",
    date: "12/01/2026",
    description: "Smartphone Samsung",
    category: "Eletrônicos",
    categoryColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    installment: "3/12",
    amount: 1299.99,
  },
  {
    id: "5",
    date: "15/01/2026",
    description: "Farmácia São Paulo",
    category: "Saúde",
    categoryColor: "bg-red-500/10 text-red-600 dark:text-red-400",
    installment: "À vista",
    amount: 89.34,
  },
  {
    id: "6",
    date: "18/01/2026",
    description: "Restaurante Outback",
    category: "Restaurantes",
    categoryColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
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
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Cabeçalho da Página */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                Faturas
              </h1>
              <p className="text-muted-foreground font-medium">
                Acompanhe o histórico e status das suas faturas
              </p>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3.5 rounded-xl border border-border/50 hover:bg-muted font-medium transition-colors shadow-sm"
            >
              <Download size={18} />
              Exportar
            </button>
          </div>

          {/* Grid de Faturas */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {invoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                month={invoice.month}
                year={invoice.year}
                status={invoice.status}
                dueDate={invoice.dueDate}
                totalAmount={invoice.totalAmount}
                purchasesCount={invoice.purchasesCount}
                isActive={selectedInvoiceId === invoice.id}
                onClick={() => setSelectedInvoiceId(invoice.id)}
              />
            ))}
          </div>

          {/* Tabela de Detalhes */}
          <div className="mb-8">
            <InvoiceTable
              month={selectedInvoice.month}
              year={selectedInvoice.year}
              items={invoiceItems}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
