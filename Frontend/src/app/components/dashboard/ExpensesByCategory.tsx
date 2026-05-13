import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { id: "alimentacao", name: "Alimentação", value: 42.5, color: "#3B82F6" },
  { id: "moradia", name: "Moradia", value: 30.0, color: "#8B5CF6" },
  { id: "transporte", name: "Transporte", value: 12.5, color: "#10B981" },
  { id: "lazer", name: "Lazer", value: 10.0, color: "#EF4444" },
  { id: "outros", name: "Outros", value: 5.0, color: "#64748B" },
];

export function ExpensesByCategory() {
  return (
    <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
      <h3 className="text-lg font-bold tracking-tight mb-6">
        Despesas por Categoria
      </h3>

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
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
            formatter={(value, entry: any) => (
              <span className="text-foreground ml-1">
                {value} - {entry.payload.value}%
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
