import { Filter } from "lucide-react";

interface TransactionFiltersProps {
  onFilter: () => void;
}

export function TransactionFilters({ onFilter }: TransactionFiltersProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 mb-6 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-2">
        {/* Período */}
        <div>
          <label
            htmlFor="period"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Período
          </label>
          <select
            id="period"
            className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
          >
            <option>Este mês</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 7 dias</option>
            <option>Mês passado</option>
            <option>Este ano</option>
            <option>Personalizado</option>
          </select>
        </div>

        {/* Conta */}
        <div>
          <label
            htmlFor="account"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Conta
          </label>
          <select
            id="account"
            className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
          >
            <option>Todas as contas</option>
            <option>Conta Corrente</option>
            <option>Poupança</option>
            <option>Cartão Crédito</option>
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Categoria
          </label>
          <select
            id="category"
            className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
          >
            <option>Todas</option>
            <option>Salário</option>
            <option>Alimentação</option>
            <option>Transporte</option>
            <option>Casa</option>
            <option>Entretenimento</option>
            <option>Renda Extra</option>
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Tipo
          </label>
          <select
            id="type"
            className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
          >
            <option>Todos</option>
            <option>Receita</option>
            <option>Despesa</option>
          </select>
        </div>

        {/* Buscar */}
        <div className="md:col-span-2 lg:col-span-2">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Buscar
          </label>
          <div className="flex gap-2">
            <input
              id="search"
              type="text"
              placeholder="Ex: Supermercado..."
              className="flex-1 px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
            />
            <button
              onClick={onFilter}
              className="px-6 py-2.5 bg-[#2B5BBA] text-white rounded-xl hover:opacity-90 font-medium transition-opacity flex items-center gap-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              <Filter size={18} />
              <span className="hidden xl:inline">Filtrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
