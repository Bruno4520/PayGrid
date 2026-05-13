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

const data = [
  { id: "jan", month: "Jan", receitas: 3800, despesas: 3100 },
  { id: "fev", month: "Fev", receitas: 3800, despesas: 2800 },
  { id: "mar", month: "Mar", receitas: 4000, despesas: 2950 },
  { id: "abr", month: "Abr", receitas: 4000, despesas: 3200 },
  { id: "mai", month: "Mai", receitas: 4500, despesas: 2700 },
  { id: "jun", month: "Jun", receitas: 4200, despesas: 1750 },
];

export function MonthlyOverview() {
  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <h3 className="text-lg font-bold tracking-tight mb-6">Visão Mensal</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#888888"
            strokeOpacity={0.2}
            vertical={false}
          />

          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--card-foreground))",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
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
    </div>
  );
}
