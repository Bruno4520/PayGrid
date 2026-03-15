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
  { id: "jan", month: "Jan", receitas: 4200, despesas: 2100 },
  { id: "fev", month: "Fev", receitas: 3800, despesas: 2000 },
  { id: "mar", month: "Mar", receitas: 4500, despesas: 2050 },
  { id: "abr", month: "Abr", receitas: 4100, despesas: 2000 },
  { id: "mai", month: "Mai", receitas: 4700, despesas: 1950 },
  { id: "jun", month: "Jun", receitas: 4300, despesas: 1900 },
];

export function MonthlyOverview() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Visão Mensal</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
          <Line
            type="monotone"
            dataKey="receitas"
            stroke="#10b981"
            strokeWidth={2}
            name="Receitas"
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
            id="line-receitas"
          />
          <Line
            type="monotone"
            dataKey="despesas"
            stroke="#ef4444"
            strokeWidth={2}
            name="Despesas"
            dot={{ fill: "#ef4444", r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
            id="line-despesas"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
