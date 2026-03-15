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
  building: "text-blue-600 bg-blue-50",
  sprout: "text-green-600 bg-green-50",
  wallet: "text-purple-600 bg-purple-50",
};

const typeColorMap = {
  checking: "text-blue-600 bg-blue-50",
  savings: "text-green-600 bg-green-50",
  wallet: "text-purple-600 bg-purple-50",
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Conta
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Saldo
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {accounts.map((account) => {
              const Icon = iconMap[account.icon];
              return (
                <tr
                  key={account.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColorMap[account.icon]}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {account.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {account.details}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${typeColorMap[account.type]}`}
                    >
                      <Icon size={14} />
                      {account.typeName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(account.balance)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(account.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        aria-label="Editar conta"
                        title="Editar conta"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(account.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label="Excluir conta"
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
