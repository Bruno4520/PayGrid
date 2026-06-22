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
      <div className="p-4 md:p-6 border-b border-border/50 bg-muted/30">
        <h3 className="text-base md:text-lg font-bold tracking-tight text-foreground">
          Detalhes da Fatura -{" "}
          <span className="text-[#2B5BBA]">
            {month} {year}
          </span>
        </h3>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Data
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Parcela
              </th>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-center text-xs sm:text-sm font-medium text-muted-foreground">
                  {item.date}
                </td>
                <td
                  className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-semibold text-foreground max-w-[140px] sm:max-w-[250px] truncate"
                  title={item.description}
                >
                  {item.description}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wide ${item.categoryColor}`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-center">
                  <span
                    className={`text-xs sm:text-sm ${item.installment === "À vista" ? "text-muted-foreground font-medium" : "text-[#2B5BBA] bg-[#2B5BBA]/10 px-2 py-0.5 rounded font-bold"}`}
                  >
                    {item.installment}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right">
                  <span className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
                    {formatCurrency(item.amount)}
                  </span>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 sm:px-6 sm:py-12 text-center text-sm font-medium text-muted-foreground"
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
