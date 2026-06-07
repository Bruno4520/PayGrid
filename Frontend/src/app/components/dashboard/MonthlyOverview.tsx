import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
}

interface MonthlyOverviewProps {
  data: MonthlyData[];
}

export function MonthlyOverview({ data = [] }: MonthlyOverviewProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  const formatCompact = (val: number) => {
    if (val >= 1000) return `R$${(val / 1000).toFixed(1)}k`;
    return `R$${val}`;
  };

  return (
    <div className="bg-card text-card-foreground rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <h3 className="text-lg font-bold tracking-tight mb-6">Visão Mensal</h3>

      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground font-medium">
          Nenhum dado disponível.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              opacity={0.1}
            />
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCompact}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), ""]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--card-foreground))",
                borderRadius: "16px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="receitas"
              stroke="#10b981"
              strokeWidth={3}
              name="Receitas"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="despesas"
              stroke="#ef4444"
              strokeWidth={3}
              name="Despesas"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
