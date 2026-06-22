import { Search } from "lucide-react";
import { useState } from "react";

export interface FilterOptions {
  search: string;
  period: string;
  account: string;
  category: string;
  type: string;
}

interface TransactionFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  accounts: string[];
  categories: string[];
}

export function TransactionFilters({
  onFilterChange,
  accounts,
  categories,
}: TransactionFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    period: "Todos",
    account: "Todas",
    category: "Todas",
    type: "Todos",
  });

  const handleChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-border/50 mb-5 md:mb-6 transition-colors duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 md:mb-2">
            Período
          </label>
          <select
            value={filters.period}
            onChange={(e) => handleChange("period", e.target.value)}
            className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
          >
            <option value="Todos">Todos os períodos</option>
            <option value="Este mês">Este mês</option>
            <option value="Últimos 30 dias">Últimos 30 dias</option>
            <option value="Mês passado">Mês passado</option>
            <option value="Este ano">Este ano</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 md:mb-2">
            Conta / Cartão
          </label>
          <select
            value={filters.account}
            onChange={(e) => handleChange("account", e.target.value)}
            className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
          >
            <option value="Todas">Todas as contas</option>
            {accounts.map((acc) => (
              <option key={acc} value={acc}>
                {acc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 md:mb-2">
            Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
          >
            <option value="Todas">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 md:mb-2">
            Tipo
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
          >
            <option value="Todos">Todos os tipos</option>
            <option value="RECEITA">Receita</option>
            <option value="DESPESA">Despesa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 md:mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              placeholder="Descrição..."
              className="w-full pl-9 pr-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
