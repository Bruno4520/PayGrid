import { Edit2, Trash2, FileText, X } from "lucide-react";
import { useState } from "react";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  paymentMethod: string;
  amount: number;
  type: "income" | "expense";
  observation?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const [selectedObservation, setSelectedObservation] = useState<string | null>(
    null,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Conta
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Forma Pgto
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {transaction.account}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold tracking-tight">
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}{" "}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          setSelectedObservation(
                            transaction.observation ||
                              "Nenhuma observação registrada.",
                          )
                        }
                        className={`p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors ${transaction.observation ? "text-[#2B5BBA]" : ""}`}
                        title="Ver observação"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(transaction.id)}
                        className="p-2 text-muted-foreground hover:text-[#2B5BBA] hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Editar transação"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir transação"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Container de Paginação */}
        <div className="px-6 py-4 border-t border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            Mostrando <span className="text-foreground">1-6</span> de{" "}
            <span className="text-foreground">156</span> transações
          </p>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 text-sm font-medium text-foreground border border-border/50 rounded-lg hover:bg-muted transition-colors">
              Anterior
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#2B5BBA] rounded-lg shadow-sm">
              1
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-foreground border border-border/50 rounded-lg hover:bg-muted transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-foreground border border-border/50 rounded-lg hover:bg-muted transition-colors">
              3
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-foreground border border-border/50 rounded-lg hover:bg-muted transition-colors">
              Próximo
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Observação Refatorado */}
      {selectedObservation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border/50">
            <div className="flex justify-between items-center p-5 border-b border-border/50">
              <h3 className="font-semibold text-lg tracking-tight">
                Observações
              </h3>
              <button
                onClick={() => setSelectedObservation(null)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-foreground/90 whitespace-pre-wrap min-h-[120px] leading-relaxed">
              {selectedObservation}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
