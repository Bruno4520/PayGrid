import React, { useState, useEffect } from "react";
import { X, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { api } from "../../../services/api";
import type { Transaction } from "./TransactionTable";

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: any) => void;
  initialType?: "receita" | "despesa";
  initialAccount?: string;
  initialPaymentMethod?: string;
  initialCardId?: string;
  transactionToEdit?: Transaction | null;
}

interface ItemBase {
  id: number;
  nome: string;
}

export function NewTransactionModal({
  isOpen,
  onClose,
  onSave,
  initialType = "receita",
  initialAccount = "",
  initialPaymentMethod = "",
  initialCardId = "",
  transactionToEdit = null,
}: NewTransactionModalProps) {
  const [type, setType] = useState<"receita" | "despesa">("receita");
  const [valor, setValor] = useState("");
  const [valorNumerico, setValorNumerico] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [contaId, setContaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [tipoTransferencia, setTipoTransferencia] = useState<
    "interna" | "externa"
  >("externa");
  const [contaDestinoId, setContaDestinoId] = useState("");
  const [tipoCartao, setTipoCartao] = useState<"credito" | "debito">("debito");
  const [parcelas, setParcelas] = useState(1);
  const [cartaoId, setCartaoId] = useState("");

  const [contas, setContas] = useState<ItemBase[]>([]);
  const [categorias, setCategorias] = useState<ItemBase[]>([]);
  const [cartoes, setCartoes] = useState<ItemBase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formasPagamentoReceita = ["dinheiro", "pix"];
  const formasPagamentoDespesa = ["dinheiro", "pix", "cartao"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchDependencias();

      if (transactionToEdit) {
        setType(
          (transactionToEdit.tipo?.toLowerCase() as "receita" | "despesa") ||
            initialType,
        );

        const valFormatted = transactionToEdit.valor.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        setValor(valFormatted);
        setValorNumerico(transactionToEdit.valor);

        setDescricao(transactionToEdit.descricao || "");
        setData(
          transactionToEdit.data
            ? new Date(transactionToEdit.data).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tEdit = transactionToEdit as any;
        setContaId(tEdit.contaId?.toString() || "");
        setCategoriaId(tEdit.categoriaId?.toString() || "");

        const formaPgtoBack = transactionToEdit.formaPagamento?.toLowerCase();
        if (formaPgtoBack === "credito" || formaPgtoBack === "debito") {
          setFormaPagamento("cartao");
          setTipoCartao(formaPgtoBack as "credito" | "debito");
        } else {
          setFormaPagamento(formaPgtoBack || "");
        }

        setCartaoId(tEdit.cartaoCreditoId?.toString() || "");
        const numParcelas = transactionToEdit.parcelas?.length || 1;
        setParcelas(numParcelas);
      } else {
        setType(initialType);
        if (initialAccount) setContaId(initialAccount);
        if (initialPaymentMethod) setFormaPagamento(initialPaymentMethod);
        if (initialPaymentMethod === "cartao") setTipoCartao("credito");
        if (initialCardId) setCartaoId(initialCardId);
      }
    } else {
      document.body.style.overflow = "unset";
      handleReset();
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
    transactionToEdit,
  ]);

  const fetchDependencias = async () => {
    try {
      const [contasRes, cartoesRes, categoriasRes] = await Promise.all([
        api.get<ItemBase[]>("/contas"),
        api.get<ItemBase[]>("/cartoes"),
        api.get<ItemBase[]>("/categorias"),
      ]);
      setContas(contasRes.data);
      setCartoes(cartoesRes.data);

      const categoriasFiltradas = categoriasRes.data.filter(
        (c) => c.nome !== "PAGAMENTO DE FATURA",
      );
      setCategorias(categoriasFiltradas);
    } catch (error) {
      toast.error("Erro ao carregar dados do formulário.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let payloadFormaPagamento = formaPagamento.toUpperCase();
      if (formaPagamento === "cartao") {
        payloadFormaPagamento = tipoCartao === "credito" ? "CREDITO" : "DEBITO";
      }

      const payload = {
        descricao,
        valor: valorNumerico,
        data: new Date(data).toISOString(),
        tipo: type.toUpperCase(),
        formaPagamento: payloadFormaPagamento,
        contaId:
          payloadFormaPagamento !== "CREDITO" && contaId
            ? Number(contaId)
            : undefined,
        cartaoCreditoId:
          payloadFormaPagamento === "CREDITO" && cartaoId
            ? Number(cartaoId)
            : undefined,
        categoriaId: categoriaId ? Number(categoriaId) : undefined,
        numeroParcelas:
          payloadFormaPagamento === "CREDITO" && parcelas > 1
            ? parcelas
            : undefined,
        ...(formaPagamento === "pix" && { tipoTransferencia }),
        ...(formaPagamento === "pix" &&
          tipoTransferencia === "interna" && {
            contaDestinoId: contaDestinoId ? Number(contaDestinoId) : undefined,
          }),
      };

      if (transactionToEdit) {
        await api.put(`/transacoes/${transactionToEdit.id}`, payload);
        toast.success("Transação atualizada com sucesso.");
      } else {
        await api.post("/transacoes", payload);
        toast.success("Transação criada com sucesso.");
      }

      if (onSave) onSave(payload);
      handleClose();
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Não foi possível salvar a transação. Verifique os dados.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setValor("");
    setValorNumerico(0);
    setDescricao("");
    setData(new Date().toISOString().split("T")[0]);
    setContaId("");
    setCategoriaId("");
    setFormaPagamento("");
    setTipoTransferencia("externa");
    setContaDestinoId("");
    setTipoCartao("debito");
    setParcelas(1);
    setCartaoId("");
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
          <h2 className="text-xl font-bold tracking-tight">
            {transactionToEdit ? "Editar Transação" : "Nova Transação"}
          </h2>
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
                  onFocus={(e) => e.target.select()}
                  placeholder="0,00"
                  className={`w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:bg-background transition-all font-semibold text-lg text-foreground placeholder:text-muted-foreground/70 ${type === "receita" ? "focus:ring-emerald-500" : "focus:ring-red-500"}`}
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Categoria
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(formaPagamento === "dinheiro" || formaPagamento === "pix") && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Conta Relacionada
              </label>
              <select
                value={contaId}
                onChange={(e) => setContaId(e.target.value)}
                className="w-full px-4 py-3.5 bg-muted/50 border border-transparent rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] focus:bg-background transition-all"
                required
              >
                <option value="">Selecione uma conta</option>
                {contas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formaPagamento === "pix" && !transactionToEdit && (
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
                    value={contaDestinoId}
                    onChange={(e) => setContaDestinoId(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all"
                    required
                  >
                    <option value="">Selecione a conta de destino</option>
                    {contas
                      .filter((c) => c.id.toString() !== contaId)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {formaPagamento === "cartao" && (
            <div className="p-5 bg-muted/30 rounded-2xl border border-border/50">
              <div className="mb-5">
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

              {tipoCartao === "debito" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Conta Relacionada
                  </label>
                  <select
                    value={contaId}
                    onChange={(e) => setContaId(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all"
                    required
                  >
                    <option value="">Selecione uma conta</option>
                    {contas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {tipoCartao === "credito" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cartão de Crédito
                    </label>
                    <select
                      value={cartaoId}
                      onChange={(e) => setCartaoId(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all"
                      required
                    >
                      <option value="">Selecione um cartão</option>
                      {cartoes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                    </select>
                  </div>

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
                </div>
              )}
            </div>
          )}
          {formaPagamento === "cartao" &&
            tipoCartao === "credito" &&
            parcelas > 1 && (
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-700 dark:text-blue-400 mt-2">
                <Info size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">
                  As compras parceladas calculam e preenchem as faturas dos
                  próximos meses automaticamente. O processamento pode levar
                  alguns segundos, por favor, não feche a janela.
                </p>
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
              disabled={isLoading}
              className={`flex-1 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${type === "receita" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20"} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading
                ? parcelas > 1 &&
                  formaPagamento === "cartao" &&
                  tipoCartao === "credito"
                  ? "Processando..."
                  : "Salvando..."
                : transactionToEdit
                  ? "Salvar Alterações"
                  : "Salvar Transação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
