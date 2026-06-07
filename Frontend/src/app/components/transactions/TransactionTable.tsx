import { Edit2, Trash2, FileText, X } from "lucide-react";
import { useState } from "react";

export interface Transaction {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  tipo: "RECEITA" | "DESPESA";
  formaPagamento: string;
  observacoes?: string;
  contaId?: number;
  categoriaId?: number;
  cartaoCreditoId?: number;
  conta?: { nome: string };
  cartaoCredito?: { nome: string };
  categoria?: { nome: string };
  parcelas?: { length: number }[];
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  isLoading = false,
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
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString("pt-BR");
  };

  const getAccountName = (transaction: Transaction) => {
    if (transaction.formaPagamento === "CREDITO" && transaction.cartaoCredito) {
      return transaction.cartaoCredito.nome;
    }
    return transaction.conta?.nome || "-";
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-12 text-center border border-border/50">
        <div className="animate-spin w-8 h-8 border-4 border-[#2B5BBA] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground font-medium">
          A carregar transações...
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-12 text-center border border-border/50">
        <p className="text-muted-foreground font-medium text-lg">
          Nenhuma transação encontrada.
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Clique em "Nova Transação" para começar.
        </p>
      </div>
    );
  }

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
                  Conta/Cartão
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
                    {formatDate(transaction.data)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {transaction.descricao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {transaction.categoria?.nome === "PAGAMENTO DE FATURA"
                      ? "Pagamento de Cartão"
                      : transaction.categoria?.nome || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {getAccountName(transaction)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <span className="capitalize">
                      {transaction.formaPagamento.toLowerCase()}
                    </span>
                    {transaction.formaPagamento === "CREDITO" &&
                      transaction.parcelas &&
                      transaction.parcelas.length > 1 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#2B5BBA]/10 text-[#2B5BBA]">
                          {transaction.parcelas.length}x
                        </span>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold tracking-tight">
                    <span
                      className={
                        transaction.tipo === "RECEITA"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {transaction.tipo === "RECEITA" ? "+" : "-"}{" "}
                      {formatCurrency(transaction.valor)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 opacity-60 md:opacity-15 md:group-hover:opacity-100 transition-opacity duration-200">
                      {transaction.observacoes && (
                        <button
                          onClick={() =>
                            setSelectedObservation(transaction.observacoes!)
                          }
                          className="p-2 text-muted-foreground hover:text-[#2B5BBA] hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Ver observação"
                        >
                          <FileText size={16} />
                        </button>
                      )}
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
      </div>

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
