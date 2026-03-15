export interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  category: string;
  categoryColor: string;
  installment: string;
  amount: number;
}

interface InvoiceTableProps {
  month: string;
  year: number;
  items: InvoiceItem[];
}

export function InvoiceTable({ month, year, items }: InvoiceTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Detalhes da Fatura - {month} {year}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Parcela
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.categoryColor}`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.installment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
