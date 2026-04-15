import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface NewTransactionModal {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: TransactionData) => void;
}

export interface TransactionData {
  type: "receita" | "despesa";
  valor: string;
  descricao: string;
  data: string;
  conta: string;
  categoria: string;
  formaPagamento?: string;
  tipoTransferencia?: "interna" | "externa";
  contaDestino?: string;
  tipoCartao?: "credito" | "debito";
  parcelas?: number;
}

export function NewTransactionModal({
  isOpen,
  onClose,
  onSave,
}: NewTransactionModal) {
  const [type, setType] = useState<"receita" | "despesa">("receita");
  const [valor, setValor] = useState("");
  const [valorNumerico, setValorNumerico] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [conta, setConta] = useState("");
  const [categoria, setCategoria] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [tipoTransferencia, setTipoTransferencia] = useState<
    "interna" | "externa"
  >("externa");
  const [contaDestino, setContaDestino] = useState("");
  const [tipoCartao, setTipoCartao] = useState<"credito" | "debito">("debito");
  const [parcelas, setParcelas] = useState(1);

  // Mock data - substituir por dados reais da sua aplicação
  const contas = ["Conta Corrente", "Conta Poupança", "Carteira"];
  const categorias = [
    "Alimentação",
    "Transporte",
    "Saúde",
    "Lazer",
    "Salário",
    "Investimentos",
  ];

  const formasPagamentoReceita = ["dinheiro", "pix"];
  const formasPagamentoDespesa = ["dinheiro", "pix", "cartao"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transaction: TransactionData = {
      type,
      valor,
      descricao,
      data,
      conta,
      categoria,
      formaPagamento,
      ...(formaPagamento === "pix" && { tipoTransferencia }),
      ...(formaPagamento === "pix" &&
        tipoTransferencia === "interna" && { contaDestino }),
      ...(formaPagamento === "cartao" && { tipoCartao }),
      ...(formaPagamento === "cartao" &&
        tipoCartao === "credito" && { parcelas }),
    };

    if (onSave) {
      onSave(transaction);
    }

    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setValor("");
    setDescricao("");
    setData(new Date().toISOString().split("T")[0]);
    setConta("");
    setCategoria("");
    setFormaPagamento("");
    setTipoTransferencia("externa");
    setContaDestino("");
    setTipoCartao("debito");
    setParcelas(1);
    onClose();
  };

  const formatCurrency = (value: string) => {
    if (!value) return { formatted: "", valor: "0" };

    const numbers = value.replace(/\D/g, "");
    if (!numbers) return { formatted: "", valor: "0" };

    const amount = parseFloat(numbers) / 100;
    return {
      formatted: amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      valor: amount.toFixed(2),
    };
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formatted, valor } = formatCurrency(e.target.value);
    setValor(formatted);
    setValorNumerico(parseFloat(valor));
  };

  const getValorParcela = (numParcelas: number) => {
    if (
      formaPagamento === "cartao" &&
      tipoCartao === "credito" &&
      numParcelas > 0 &&
      valorNumerico
    ) {
      const parcela = valorNumerico / numParcelas;
      return parcela.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return "0,00";
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900">
            Nova Transação
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tipo de Transação */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setType("receita");
                setFormaPagamento("");
              }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                type === "receita"
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => {
                setType("despesa");
                setFormaPagamento("");
              }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                type === "despesa"
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Despesa
            </button>
          </div>

          {/* Grid de 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  R$
                </span>
                <input
                  type="text"
                  value={valor}
                  onChange={handleValorChange}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Descrição (largura completa) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Compra no supermercado"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Grid de 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Conta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conta
              </label>
              <select
                value={conta}
                onChange={(e) => setConta(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                required
              >
                <option value="">Selecione uma conta</option>
                {contas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma de Pagamento
            </label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              required
            >
              <option value="">Selecione a forma de pagamento</option>
              {(type === "receita"
                ? formasPagamentoReceita
                : formasPagamentoDespesa
              ).map((forma) => (
                <option key={forma} value={forma}>
                  {forma.charAt(0).toUpperCase() + forma.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Opções PIX */}
          {formaPagamento === "pix" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Transferência
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoTransferencia("externa")}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      tipoTransferencia === "externa"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Externa
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoTransferencia("interna")}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      tipoTransferencia === "interna"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Interna
                  </button>
                </div>
              </div>

              {tipoTransferencia === "interna" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conta de Destino
                  </label>
                  <select
                    value={contaDestino}
                    onChange={(e) => setContaDestino(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Selecione a conta de destino</option>
                    {contas
                      .filter((c) => c !== conta)
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* Opções Cartão */}
          {formaPagamento === "cartao" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cartão
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoCartao("debito")}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      tipoCartao === "debito"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Débito
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoCartao("credito")}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      tipoCartao === "credito"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Crédito
                  </button>
                </div>
              </div>

              {tipoCartao === "credito" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Parcelas
                  </label>
                  <select
                    value={parcelas}
                    onChange={(e) => setParcelas(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    {[...Array(12)].map((_, i) => {
                      const num = i + 1;
                      return (
                        <option key={num} value={num}>
                          {`${num.toString().padStart(2, "0")}x de R$ ${getValorParcela(num)}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 rounded-xl font-medium text-white transition-all shadow-lg ${
                type === "receita"
                  ? "bg-green-500 hover:bg-green-600 shadow-green-500/30"
                  : "bg-red-500 hover:bg-red-600 shadow-red-500/30"
              }`}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
