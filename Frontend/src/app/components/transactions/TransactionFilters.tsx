import { Filter } from "lucide-react";

interface TransactionFiltersProps {
  onFilter: () => void;
}

export function TransactionFilters({ onFilter }: TransactionFiltersProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
        {/* Período */}
        <div>
          <label htmlFor="period" className="block text-sm text-gray-700 mb-2">
            Período
          </label>
          <select
            id="period"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
          >
            <option>Últimos 30 dias</option>
            <option>Últimos 7 dias</option>
            <option>Este mês</option>
            <option>Mês passado</option>
            <option>Este ano</option>
            <option>Personalizado</option>
          </select>
        </div>

        {/* Conta */}
        <div>
          <label htmlFor="account" className="block text-sm text-gray-700 mb-2">
            Conta
          </label>
          <select
            id="account"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
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
            className="block text-sm text-gray-700 mb-2"
          >
            Categoria
          </label>
          <select
            id="category"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
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
          <label htmlFor="type" className="block text-sm text-gray-700 mb-2">
            Tipo
          </label>
          <select
            id="type"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
          >
            <option>Todos</option>
            <option>Receita</option>
            <option>Despesa</option>
          </select>
        </div>

        {/* Buscar */}
        <div className="md:col-span-2 lg:col-span-2">
          <label htmlFor="search" className="block text-sm text-gray-700 mb-2">
            Buscar
          </label>
          <div className="flex gap-2">
            <input
              id="search"
              type="text"
              placeholder="Descrição..."
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:border-transparent"
            />
            <button
              onClick={onFilter}
              className="px-6 py-2.5 bg-[#2B5BBA] text-white rounded-lg hover:bg-[#1e4594] transition-colors flex items-center gap-2 shrink-0"
            >
              <Filter size={16} />
              <span className="hidden lg:inline">Filtrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
