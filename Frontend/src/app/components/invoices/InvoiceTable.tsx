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
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border/50 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-border/50 bg-muted/30">
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          Detalhes da Fatura -{" "}
          <span className="text-[#2B5BBA]">
            {month} {year}
          </span>
        </h3>
      </div>

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
                Parcela
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-foreground">
                  {item.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-md text-xs font-bold tracking-wide ${item.categoryColor}`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-foreground">
                  {item.installment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-bold tracking-tight text-foreground">
                    {formatCurrency(item.amount)}
                  </span>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm font-medium text-muted-foreground"
                >
                  Nenhuma compra encontrada para esta fatura.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
