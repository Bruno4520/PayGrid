import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export interface CategoryData {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface ExpensesByCategoryProps {
  data: CategoryData[];
}

export function ExpensesByCategory({ data = [] }: ExpensesByCategoryProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="bg-card text-card-foreground rounded-3xl p-5 md:p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <h3 className="text-lg font-bold tracking-tight mb-5 md:mb-6">
        Despesas do Mês por Categoria
      </h3>

      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground font-medium text-center px-4">
          Nenhuma despesa registada este mês.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Total"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
                borderRadius: "16px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
