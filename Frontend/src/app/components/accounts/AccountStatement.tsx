import {
  Search,
  Edit2,
  Trash2,
  ArrowDownUp,
  Plus,
  Loader2,
} from "lucide-react";

export interface StatementTransaction {
  id: number;
  descricao: string;
  valor: number;
  tipo: "RECEITA" | "DESPESA";
  formaPagamento: string;
  categoria?: { nome: string };
  dateFormatted: string;
  timeFormatted: string;
  accountName: string;
}

interface AccountStatementProps {
  transactions: StatementTransaction[];
  activeFilter: string;
  accountName?: string;
  deletingTransactionId?: number | null;
  onNewTransaction: () => void;
  onEditTransaction: (transaction: StatementTransaction) => void;
  onDeleteTransaction: (id: number) => void;
}

export function AccountStatement({
  transactions,
  activeFilter,
  accountName,
  deletingTransactionId,
  onNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
}: AccountStatementProps) {
  return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2B5BBA]/10 text-[#2B5BBA] rounded-xl flex items-center justify-center shrink-0">
            <ArrowDownUp size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Extrato de Movimentações
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeFilter === "all"
                ? "Acompanhe as entradas e saídas de todas as contas"
                : `Movimentações da conta ${accountName || ""}`}
            </p>
          </div>
        </div>

        <button
          onClick={onNewTransaction}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2B5BBA]/10 text-[#2B5BBA] hover:bg-[#2B5BBA]/20 font-bold rounded-xl transition-colors shrink-0"
        >
          <Plus size={18} /> Nova Movimentação
        </button>
      </div>

      <div className="p-2">
        {transactions.length === 0 ? (
          <div className="py-12 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground font-medium">
              Nenhuma movimentação encontrada.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {transactions.map((t) => {
              const isDeleting = deletingTransactionId === t.id;

              return (
                <div
                  key={t.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 md:px-6 hover:bg-muted/30 transition-colors group rounded-xl ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex items-start gap-4 mb-3 sm:mb-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted flex-shrink-0 mt-1 sm:mt-0 text-muted-foreground">
                      <span className="font-bold text-sm">
                        {t.dateFormatted.split("/")[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base leading-tight mb-1">
                        {t.descricao}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="bg-muted px-2 py-0.5 rounded-md">
                          {t.categoria?.nome || "Outros"}
                        </span>
                        <span>•</span>
                        <span>{t.accountName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-0 border-border/50 pt-3 sm:pt-0 mt-1 sm:mt-0">
                    <div className="text-left sm:text-right">
                      <p
                        className={`font-bold tracking-tight text-lg ${t.tipo === "RECEITA" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {t.tipo === "RECEITA" ? "+" : "-"}{" "}
                        {t.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground capitalize">
                        {t.formaPagamento.toLowerCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTransaction(t);
                        }}
                        disabled={isDeleting || deletingTransactionId !== null}
                        className="p-2 text-muted-foreground hover:text-[#2B5BBA] hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTransaction(t.id);
                        }}
                        disabled={isDeleting || deletingTransactionId !== null}
                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? (
                          <Loader2
                            size={18}
                            className="animate-spin text-red-600"
                          />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
