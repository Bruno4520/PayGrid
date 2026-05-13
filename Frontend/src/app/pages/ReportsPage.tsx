import { useState } from "react";
import { Download, X, Filter } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { ReportSummaryCard } from "../components/reports/ReportSummaryCard";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const categoryData = [
  { id: "moradia", name: "Moradia", value: 34.4, color: "#3B82F6" },
  { id: "alimentacao", name: "Alimentação", value: 28.6, color: "#10B981" },
  { id: "transporte", name: "Transporte", value: 13.7, color: "#8B5CF6" },
  { id: "lazer", name: "Lazer", value: 8.36, color: "#F59E0B" },
  { id: "saude", name: "Saúde", value: 8.36, color: "#EF4444" },
  { id: "educacao", name: "Educação", value: 6.73, color: "#EC4899" },
];

const comparisonData = [
  { id: "jan", month: "Jan", receitas: 11000, despesas: 8500 },
  { id: "fev", month: "Fev", receitas: 11500, despesas: 8200 },
  { id: "mar", month: "Mar", receitas: 11800, despesas: 8000 },
  { id: "abr", month: "Abr", receitas: 12000, despesas: 8300 },
  { id: "mai", month: "Mai", receitas: 12200, despesas: 8100 },
  { id: "jun", month: "Jun", receitas: 12450, despesas: 8730 },
];

const evolutionData = [
  { id: "jan", month: "Jan", receitas: 11000, despesas: 8500, saldo: 2500 },
  { id: "fev", month: "Fev", receitas: 11500, despesas: 8200, saldo: 3300 },
  { id: "mar", month: "Mar", receitas: 11800, despesas: 8000, saldo: 3800 },
  { id: "abr", month: "Abr", receitas: 12000, despesas: 8300, saldo: 3700 },
  { id: "mai", month: "Mai", receitas: 12200, despesas: 8100, saldo: 4100 },
  { id: "jun", month: "Jun", receitas: 12450, despesas: 8730, saldo: 3720 },
];

export function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Últimos 30 dias");
  const [selectedAccount, setSelectedAccount] = useState("Todas as contas");
  const [selectedCategory, setSelectedCategory] = useState(
    "Todas as categorias",
  );

  const handleClear = () => {
    setSelectedPeriod("Últimos 30 dias");
    setSelectedAccount("Todas as contas");
    setSelectedCategory("Todas as categorias");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card text-card-foreground border border-border/50 p-4 rounded-xl shadow-lg">
          <p className="font-bold mb-3 pb-2 border-b border-border/50">
            {label || "Categoria"}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm font-medium flex items-center gap-2 mb-1"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-bold">{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Relatórios
            </h1>
            <p className="text-muted-foreground font-medium">
              Visualize indicadores e tendências das suas finanças
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 mb-8 transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Período
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all"
                >
                  <option>Últimos 7 dias</option>
                  <option>Últimos 30 dias</option>
                  <option>Últimos 90 dias</option>
                  <option>Este ano</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Conta
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all"
                >
                  <option>Todas as contas</option>
                  <option>Banco do Brasil</option>
                  <option>Nubank</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all"
                >
                  <option>Todas as categorias</option>
                  <option>Moradia</option>
                  <option>Alimentação</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full inline-flex items-center justify-center gap-2 bg-[#2B5BBA] text-white px-6 py-3 rounded-xl hover:opacity-90 font-bold transition-opacity shadow-sm">
                  <Filter size={18} />
                  Aplicar Filtros
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} /> Limpar
              </button>
              <button
                onClick={() => console.log("Exportar")}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download size={16} /> Exportar Relatório
              </button>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ReportSummaryCard
              type="income"
              value={12450.0}
              percentageChange={13.1}
            />
            <ReportSummaryCard
              type="expense"
              value={8730.0}
              percentageChange={-5.2}
            />
            <ReportSummaryCard
              type="balance"
              value={3720.0}
              percentageChange={21.8}
            />
          </div>

          {/* Gráficos Linha 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* PieChart */}
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Despesas por Categoria
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{
                      fontSize: "12px",
                      fontWeight: "500",
                      fill: "currentColor",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* BarChart */}
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Receitas vs Despesas
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={comparisonData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.15}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "var(--border)", opacity: 0.2 }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", fontWeight: "500" }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="receitas"
                    fill="#10B981"
                    name="Receitas"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="despesas"
                    fill="#EF4444"
                    name="Despesas"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico Linha 2 */}
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300">
            <h3 className="text-lg font-bold text-foreground mb-6">
              Evolução Mensal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={evolutionData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", fontWeight: "500" }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="receitas"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Receitas"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="despesas"
                  stroke="#EF4444"
                  strokeWidth={3}
                  name="Despesas"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Saldo"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
