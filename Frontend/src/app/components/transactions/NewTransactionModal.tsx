import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: TransactionData) => void;
  initialType?: "receita" | "despesa";
  initialAccount?: string;
  initialPaymentMethod?: string;
  initialCardId?: string;
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
  cartaoId?: string;
}

export function NewTransactionModal({
  isOpen,
  onClose,
  onSave,
  initialType = "receita",
  initialAccount = "",
  initialPaymentMethod = "",
  initialCardId = "",
}: NewTransactionModalProps) {
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
  const [cartaoId, setCartaoId] = useState("");

  const contas = ["Conta Corrente", "Conta Poupança", "Carteira"];
  const categorias = [
    "Alimentação",
    "Transporte",
    "Saúde",
    "Casa",
    "Lazer",
    "Salário",
    "Renda Extra",
    "Investimentos",
  ];
  const formasPagamentoReceita = ["dinheiro", "pix"];
  const formasPagamentoDespesa = ["dinheiro", "pix", "cartao"];
  const cartoesMock = [
    { id: "1", name: "Itaú Click" },
    { id: "2", name: "Nubank Ultravioleta" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setType(initialType);
      if (initialAccount) setConta(initialAccount);
      if (initialPaymentMethod) setFormaPagamento(initialPaymentMethod);
      if (initialPaymentMethod === "cartao") setTipoCartao("credito");
      if (initialCardId) setCartaoId(initialCardId);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    isOpen,
    initialType,
    initialAccount,
    initialPaymentMethod,
    initialCardId,
  ]);

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
      ...(formaPagamento === "cartao" && { tipoCartao, cartaoId }),
      ...(formaPagamento === "cartao" &&
        tipoCartao === "credito" && { parcelas }),
    };
    if (onSave) onSave(transaction);
    handleClose();
  };

  const handleClose = () => {
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
    setCartaoId("");
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border/50 animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-card/80 backdrop-blur-md border-b border-border/50 px-8 py-5 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl font-bold tracking-tight">Nova Transação</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setType("receita");
                setFormaPagamento("");
              }}
              className={`flex-1 py-3.5 rounded-xl font-bold tracking-wide transition-all ${
                type === "receita"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
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
              className={`flex-1 py-3.5 rounded-xl font-bold tracking-wide transition-all ${
                type === "despesa"
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/20 scale-[1.02]"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              Despesa
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Valor
              </label>
              <div className="relative">
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold transition-colors duration-300 ${type === "receita" ? "text-emerald-500" : "text-red-500"}`}
                >
                  R$
                </span>
                <input
                  type="text"
                  value={valor}
                  onChange={handleValorChange}
                  placeholder="0,00"
                  className={`w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:bg-background transition-all font-semibold text-lg text-foreground placeholder:text-muted-foreground/70 ${
                    type === "receita"
                      ? "focus:ring-emerald-500"
                      : "focus:ring-red-500"
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Compra no supermercado"
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Conta Relacionada
              </label>
              <select
                value={conta}
                onChange={(e) => setConta(e.target.value)}
                className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Forma de Pagamento
            </label>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
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

          {formaPagamento === "pix" && (
            <div className="p-5 bg-muted/30 rounded-2xl border border-border/50">
              <label className="block text-sm font-medium text-foreground mb-3">
                Tipo de Transferência
              </label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setTipoTransferencia("externa")}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${tipoTransferencia === "externa" ? "bg-[#2B5BBA] text-white shadow-md shadow-blue-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  Externa
                </button>
                <button
                  type="button"
                  onClick={() => setTipoTransferencia("interna")}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${tipoTransferencia === "interna" ? "bg-[#2B5BBA] text-white shadow-md shadow-blue-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  Interna
                </button>
              </div>

              {tipoTransferencia === "interna" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Conta de Destino
                  </label>
                  <select
                    value={contaDestino}
                    onChange={(e) => setContaDestino(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all"
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
            </div>
          )}

          {formaPagamento === "cartao" && (
            <div className="p-5 bg-muted/30 rounded-2xl border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                {/* Seleção do Cartão */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cartão
                  </label>
                  <select
                    value={cartaoId}
                    onChange={(e) => setCartaoId(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all"
                    required
                  >
                    <option value="">Selecione um cartão</option>
                    {cartoesMock.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tipo de Uso
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTipoCartao("debito")}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${tipoCartao === "debito" ? "bg-[#2B5BBA] text-white shadow-md shadow-blue-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      Débito
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoCartao("credito")}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${tipoCartao === "credito" ? "bg-[#2B5BBA] text-white shadow-md shadow-blue-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      Crédito
                    </button>
                  </div>
                </div>
              </div>

              {tipoCartao === "credito" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Número de Parcelas
                  </label>
                  <select
                    value={parcelas}
                    onChange={(e) => setParcelas(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all font-medium"
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
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-border/50 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3.5 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${type === "receita" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20"}`}
            >
              Salvar Transação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
