import { Building2, Sprout, Wallet, Edit2, Trash2 } from "lucide-react";

export interface Account {
  id: string;
  name: string;
  details: string;
  type: "checking" | "savings" | "wallet";
  typeName: string;
  balance: number;
  icon: "building" | "sprout" | "wallet";
}

interface AccountsTableProps {
  accounts: Account[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const iconMap = {
  building: Building2,
  sprout: Sprout,
  wallet: Wallet,
};

const iconColorMap = {
  building: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  sprout: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  wallet: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
};

const typeColorMap = {
  checking: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  savings: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  wallet: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
};

export function AccountsTable({
  accounts,
  onEdit,
  onDelete,
}: AccountsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Conta
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Saldo
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {accounts.map((account) => {
              const Icon = iconMap[account.icon];
              return (
                <tr
                  key={account.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${iconColorMap[account.icon]}`}
                      >
                        <Icon className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                      </div>
                      <div className="min-w-0 flex-1 max-w-[140px] sm:max-w-[250px]">
                        <p
                          className="text-sm font-semibold text-foreground mb-0.5 truncate"
                          title={account.name}
                        >
                          {account.name}
                        </p>
                        <p
                          className="text-xs font-medium text-muted-foreground truncate"
                          title={account.details}
                        >
                          {account.details}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full text-[10px] sm:text-xs font-bold ${typeColorMap[account.type]}`}
                    >
                      <Icon size={14} />
                      {account.typeName}
                    </span>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-bold tracking-tight text-foreground">
                      {formatCurrency(account.balance)}
                    </span>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 opacity-60 md:opacity-15 md:group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onEdit(account.id)}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-[#2B5BBA] hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Editar conta"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(account.id)}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir conta"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
