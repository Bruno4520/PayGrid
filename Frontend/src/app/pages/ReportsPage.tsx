import { useState, useEffect } from "react";
import { X, Filter, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { ReportSummaryCard } from "../components/reports/ReportSummaryCard";
import { api } from "../../services/api";
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

interface ResumoItem {
  valor: number;
  variacao: number;
}

interface CategoriaData {
  id: string;
  name: string;
  value: number;
  color: string;
  percent: number;
}

interface EvolucaoData {
  label: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

interface RelatorioData {
  resumo: {
    receitas: ResumoItem;
    despesas: ResumoItem;
    saldo: ResumoItem;
  };
  categorias: CategoriaData[];
  evolucao: EvolucaoData[];
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}

interface ItemOrigem {
  id: number;
  nome: string;
}

export function ReportsPage() {
  const [data, setData] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(true);

  const [contas, setContas] = useState<ItemOrigem[]>([]);
  const [cartoes, setCartoes] = useState<ItemOrigem[]>([]);

  const [periodo, setPeriodo] = useState("30");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);

  const loadSources = async () => {
    try {
      const [contasRes, cartoesRes] = await Promise.all([
        api.get<ItemOrigem[]>("/contas"),
        api.get<ItemOrigem[]>("/cartoes"),
      ]);
      setContas(contasRes.data);
      setCartoes(cartoesRes.data);
    } catch (error) {
      toast.error("Erro ao carregar fontes de dados.");
    }
  };

  const fetchRelatorios = async () => {
    try {
      setLoading(true);

      let params = `?periodo=${periodo}`;

      const contasIds = selectedSources
        .filter((s) => s.startsWith("conta_"))
        .map((s) => s.replace("conta_", ""));
      const cartoesIds = selectedSources
        .filter((s) => s.startsWith("cartao_"))
        .map((s) => s.replace("cartao_", ""));

      if (contasIds.length > 0) params += `&contas=${contasIds.join(",")}`;
      if (cartoesIds.length > 0) params += `&cartoes=${cartoesIds.join(",")}`;

      const res = await api.get<RelatorioData>(`/relatorios${params}`);
      setData(res.data);
    } catch (error) {
      toast.error("Erro ao carregar relatórios financeiros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  useEffect(() => {
    fetchRelatorios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo, selectedSources]);

  const handleClear = () => {
    setPeriodo("30");
    setSelectedSources([]);
  };

  const toggleSource = (sourceKey: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceKey)
        ? prev.filter((s) => s !== sourceKey)
        : [...prev, sourceKey],
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const CustomPieTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategoriaData;
      return (
        <div className="bg-card/95 backdrop-blur-sm text-card-foreground border border-border/50 p-4 rounded-2xl shadow-xl z-50">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <p className="font-bold text-base">{item.name}</p>
          </div>
          <p className="text-2xl font-bold tracking-tight mb-1">
            {formatCurrency(item.value)}
          </p>
          <div className="inline-block bg-muted px-2 py-1 rounded-md">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {item.percent}% do total
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieLegend = ({ payload }: CustomTooltipProps) => {
    if (!payload) return null;
    return (
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 pt-4">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: entry.payload.color }}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {entry.value}
            </span>
            <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
              {entry.payload.percent}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  const CustomBarLineTooltip = ({
    active,
    payload,
    label,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm text-card-foreground border border-border/50 p-4 rounded-2xl shadow-xl min-w-[200px] z-50">
          <p className="font-bold text-base mb-3 pb-2 border-b border-border/50">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-6 mb-2 last:mb-0"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {entry.name}
                </span>
              </div>
              <span className="text-sm font-bold">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const isDailyGranularity = periodo === "7" || periodo === "30";

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Relatórios
            </h1>
            <p className="text-muted-foreground font-medium">
              Visualize indicadores e tendências das suas finanças
            </p>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 mb-8 transition-colors duration-300 relative z-20">
            <div className="flex items-center gap-2 mb-4 text-foreground font-bold">
              <Filter size={18} /> Filtros e Visões
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Período Analisado
                </label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                  <option value="ano">Este ano</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Origem dos Gastos
                </label>
                <button
                  onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                  className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all flex items-center justify-between"
                >
                  <span className="truncate">
                    {selectedSources.length === 0
                      ? "Todas as Origens"
                      : `${selectedSources.length} Origem(ns) selecionada(s)`}
                  </span>
                  <ChevronDown size={18} className="text-muted-foreground" />
                </button>

                {isSourceDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSourceDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-card border border-border/50 rounded-2xl shadow-xl z-50 p-2 max-h-72 overflow-y-auto">
                      <div className="p-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Contas Correntes
                      </div>
                      {contas.map((c) => {
                        const key = `conta_${c.id}`;
                        const isSelected = selectedSources.includes(key);
                        return (
                          <button
                            key={key}
                            onClick={() => toggleSource(key)}
                            className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted rounded-xl transition-colors text-left"
                          >
                            <span
                              className={
                                isSelected
                                  ? "text-[#2B5BBA] font-bold"
                                  : "text-foreground"
                              }
                            >
                              {c.nome}
                            </span>
                            {isSelected && (
                              <Check size={16} className="text-[#2B5BBA]" />
                            )}
                          </button>
                        );
                      })}

                      <div className="p-2 mt-2 text-xs font-bold text-muted-foreground uppercase tracking-wider border-t border-border/50 pt-3">
                        Cartões de Crédito
                      </div>
                      {cartoes.map((c) => {
                        const key = `cartao_${c.id}`;
                        const isSelected = selectedSources.includes(key);
                        return (
                          <button
                            key={key}
                            onClick={() => toggleSource(key)}
                            className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted rounded-xl transition-colors text-left"
                          >
                            <span
                              className={
                                isSelected
                                  ? "text-[#2B5BBA] font-bold"
                                  : "text-foreground"
                              }
                            >
                              {c.nome}
                            </span>
                            {isSelected && (
                              <Check size={16} className="text-[#2B5BBA]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleClear}
                  className="px-5 py-3 w-full lg:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                >
                  <X size={16} /> Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {loading || !data ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground font-medium animate-pulse">
              A gerar os seus relatórios e desenhar gráficos...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ReportSummaryCard
                  type="income"
                  value={data.resumo.receitas.valor}
                  percentageChange={data.resumo.receitas.variacao}
                />
                <ReportSummaryCard
                  type="expense"
                  value={data.resumo.despesas.valor}
                  percentageChange={data.resumo.despesas.variacao}
                />
                <ReportSummaryCard
                  type="balance"
                  value={data.resumo.saldo.valor}
                  percentageChange={data.resumo.saldo.variacao}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300 flex flex-col items-center z-10">
                  <h3 className="text-lg w-full text-left font-bold text-foreground mb-4">
                    Despesas por Categoria
                  </h3>
                  <div className="w-full flex-1 flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={400}>
                      {data.categorias && data.categorias.length > 0 ? (
                        <PieChart>
                          <Pie
                            data={data.categorias}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            innerRadius={75}
                            outerRadius={100}
                            paddingAngle={5}
                            cornerRadius={8}
                            stroke="none"
                          >
                            {data.categorias.map((entry, index) => (
                              <Cell
                                key={index}
                                fill={entry.color}
                                stroke="none"
                                style={{
                                  outline: "none",
                                  filter:
                                    "drop-shadow(0px 3px 4px rgba(0,0,0,0.1))",
                                }}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={<CustomPieTooltip />}
                            cursor={{ fill: "transparent" }}
                          />
                          <Legend
                            content={<CustomPieLegend />}
                            verticalAlign="bottom"
                          />
                        </PieChart>
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground font-medium">
                          Sem despesas no período selecionado.
                        </div>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300 flex flex-col z-10">
                  <h3 className="text-lg font-bold text-foreground mb-6">
                    Evolução {isDailyGranularity ? "Diária" : "Mensal"}{" "}
                    (Receitas vs Despesas)
                  </h3>
                  <div className="flex-1 min-h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.evolucao}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="currentColor"
                          opacity={0.08}
                        />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#9CA3AF",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#9CA3AF",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                          tickFormatter={(value) =>
                            value >= 1000 ? `${value / 1000}k` : value
                          }
                          dx={-10}
                        />
                        <Tooltip
                          content={<CustomBarLineTooltip />}
                          cursor={{ fill: "currentColor", opacity: 0.04 }}
                        />
                        <Legend
                          wrapperStyle={{
                            paddingTop: "20px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                          iconType="circle"
                        />
                        <Bar
                          dataKey="receitas"
                          name="Receitas"
                          fill="#10B981"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar
                          dataKey="despesas"
                          name="Despesas"
                          fill="#EF4444"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 transition-colors duration-300 lg:col-span-2 z-10">
                  <h3 className="text-lg font-bold text-foreground mb-6">
                    Evolução de Saldo{" "}
                    {isDailyGranularity ? "Líquido" : "Mensal"}
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={data.evolucao}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="currentColor"
                        opacity={0.08}
                      />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#9CA3AF",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#9CA3AF",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        tickFormatter={(value) =>
                          value >= 1000 ? `${value / 1000}k` : value
                        }
                        dx={-10}
                      />
                      <Tooltip
                        content={<CustomBarLineTooltip />}
                        cursor={{ stroke: "currentColor", opacity: 0.1 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="saldo"
                        name="Saldo"
                        stroke="#3B82F6"
                        strokeWidth={4}
                        dot={{ r: 5, strokeWidth: 0, fill: "#3B82F6" }}
                        activeDot={{ r: 7, strokeWidth: 0, fill: "#2563EB" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
