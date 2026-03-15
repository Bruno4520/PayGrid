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
  { id: "moradia", name: "Moradia", value: 34.4, color: "#EF4444" },
  { id: "alimentacao", name: "Alimentação", value: 28.6, color: "#3B82F6" },
  { id: "transporte", name: "Transporte", value: 13.7, color: "#8B5CF6" },
  { id: "lazer", name: "Lazer", value: 8.36, color: "#F97316" },
  { id: "saude", name: "Saúde", value: 8.36, color: "#14B8A6" },
  { id: "educacao", name: "Educação", value: 6.73, color: "#FBBF24" },
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

  const handleExport = () => {
    console.log("Exportar relatório");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header userName="João Silva" userRole="Administrador" />

        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Relatórios
            </h1>
            <p className="text-gray-600">
              Visualize indicadores e tendências das suas finanças
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
                >
                  <option>Últimos 7 dias</option>
                  <option>Últimos 30 dias</option>
                  <option>Últimos 90 dias</option>
                  <option>Últimos 12 meses</option>
                  <option>Este ano</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conta
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
                >
                  <option>Todas as contas</option>
                  <option>Banco do Brasil</option>
                  <option>Nubank</option>
                  <option>Inter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
                >
                  <option>Todas as categorias</option>
                  <option>Moradia</option>
                  <option>Alimentação</option>
                  <option>Transporte</option>
                  <option>Lazer</option>
                  <option>Saúde</option>
                  <option>Educação</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full inline-flex items-center justify-center gap-2 bg-[#2B5BBA] text-white px-6 py-2.5 rounded-lg hover:bg-[#1e4594] transition-colors">
                  <Filter size={18} />
                  Aplicar Filtros
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X size={16} />
                Limpar
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Download size={16} />
                Exportar
              </button>
            </div>
          </div>

          {/* Summary Cards */}
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

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Despesas por Categoria */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
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
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={false}
                    id="pie-category"
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: "12px" }}
                    formatter={(value, entry: any) =>
                      `${value} - ${entry.payload.value}%`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Receitas vs Despesas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Receitas vs Despesas
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={comparisonData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} iconType="rect" />
                  <Bar
                    dataKey="receitas"
                    fill="#10B981"
                    name="Receitas"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                    id="bar-receitas"
                  />
                  <Bar
                    dataKey="despesas"
                    fill="#EF4444"
                    name="Despesas"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false}
                    id="bar-despesas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Evolução Mensal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={evolutionData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
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
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Receitas"
                  dot={{ fill: "#10B981", r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                  id="line-evolution-receitas"
                />
                <Line
                  type="monotone"
                  dataKey="despesas"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Despesas"
                  dot={{ fill: "#EF4444", r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                  id="line-evolution-despesas"
                />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Saldo"
                  dot={{ fill: "#3B82F6", r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                  id="line-evolution-saldo"
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
