import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { InvoiceCard } from "../components/invoices/InvoiceCard";
import { InvoicePdfExportButton } from "../components/invoices/InvoicePdfExportButton";
import {
  InvoiceTable,
  type InvoiceItem,
} from "../components/invoices/InvoiceTable";
import { api } from "../../services/api";


const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface Fatura {
  id: number;
  mes: number;
  ano: number;
  estaPaga: boolean;
  valorTotal: number;
  dataVencimento: string;
  cartaoCredito: {
    nome: string;
  };
  parcelas: {
    id: number;
    numeroParcela: number;
    valor: number;
    transacao: {
      data: string;
      descricao: string;
      numeroParcelas?: number;
      categoria: {
        nome: string;
      } | null;
    };
  }[];
}

interface Conta {
  id: number;
  nome: string;
  saldo: number;
}


export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Fatura[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [filterCard, setFilterCard] = useState<string>("all");

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [selectedContaId, setSelectedContaId] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const fetchInvoices = async (currentSelectedId?: number | null) => {
    try {
      setLoading(true);
      const response = await api.get<Fatura[]>("/faturas");

      const sortedInvoices = response.data.sort((a, b) => {
        const dateA = new Date(a.dataVencimento).getTime();
        const dateB = new Date(b.dataVencimento).getTime();

        if (!a.estaPaga && !b.estaPaga) return dateA - dateB;
        if (a.estaPaga && b.estaPaga) return dateB - dateA;
        return !a.estaPaga ? -1 : 1;
      });

      setInvoices(sortedInvoices);

      if (sortedInvoices.length > 0) {
        if (
          !currentSelectedId ||
          !sortedInvoices.find((i) => i.id === currentSelectedId)
        ) {
          setSelectedInvoiceId(sortedInvoices[0].id);
        }
      } else {
        setSelectedInvoiceId(null);
      }
    } catch (error) {
      toast.error("Erro ao carregar faturas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(selectedInvoiceId);
    api
      .get<Conta[]>("/contas")
      .then((res) => setContas(res.data))
      .catch(() => toast.error("Não foi possível carregar as contas."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || !selectedContaId) return;

    setIsPaying(true);
    try {
      await api.post(`/faturas/${selectedInvoiceId}/pagar`, {
        contaId: Number(selectedContaId),
      });
      toast.success("Fatura paga com sucesso!");
      setIsPayModalOpen(false);
      setSelectedContaId("");
      await fetchInvoices(selectedInvoiceId);
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Erro ao pagar fatura. Verifique seu saldo.";
      toast.error(message);
    } finally {
      setIsPaying(false);
    }
  };
const uniqueCards = useMemo(() => {
    const cards = invoices.map((inv) => inv.cartaoCredito.nome);
    return Array.from(new Set(cards)).sort();
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    if (filterCard === "all") return invoices;
    return invoices.filter((inv) => inv.cartaoCredito.nome === filterCard);
  }, [invoices, filterCard]);

  useEffect(() => {
    if (filteredInvoices.length > 0) {
      if (!filteredInvoices.find((i) => i.id === selectedInvoiceId)) {
        setSelectedInvoiceId(filteredInvoices[0].id);
      }
    } else {
      setSelectedInvoiceId(null);
    }
  }, [filteredInvoices, selectedInvoiceId]);

  const selectedInvoice =
    filteredInvoices.find((inv) => inv.id === selectedInvoiceId) ||
    filteredInvoices[0];

  const tableItems: InvoiceItem[] = useMemo(() => {
    if (!selectedInvoice?.parcelas) return [];

    return selectedInvoice.parcelas.map((p) => {
      const t = p.transacao;
      const tDate = new Date(t.data);
      tDate.setMinutes(tDate.getMinutes() + tDate.getTimezoneOffset());

      const catName = t.categoria?.nome?.toLowerCase() || "";
      let colorClass = "bg-muted text-muted-foreground";

      if (catName.includes("alimentação") || catName.includes("comida")) {
        colorClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      } else if (catName.includes("transporte") || catName.includes("posto")) {
        colorClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      } else if (catName.includes("compra") || catName.includes("shopping")) {
        colorClass = "bg-red-500/10 text-red-600 dark:text-red-400";
      }

      const totalParcels = t.numeroParcelas || 1;
      const instStr =
        totalParcels > 1 ? `${p.numeroParcela}/${totalParcels}` : "À vista";

      return {
        id: String(p.id),
        date: tDate.toLocaleDateString("pt-BR"),
        description: t.descricao,
        category: t.categoria?.nome || "Outros",
        categoryColor: colorClass,
        installment: instStr,
        amount: p.valor,
      };
    });
  }, [selectedInvoice]);

  const getStatus = (inv: Fatura) => {
    if (inv.estaPaga) return "paid";
    const hoje = new Date();
    const vencimento = new Date(inv.dataVencimento);
    const msToDue = vencimento.getTime() - hoje.getTime();
    const daysToDue = msToDue / (1000 * 60 * 60 * 24);

    if (daysToDue <= 7 && daysToDue >= 0) return "closed";
    if (daysToDue < 0) return "closed";
    return "open";
  };

  const scrollCards = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);

    if (scrollContainerRef.current) {
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();

    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;

    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                Faturas
              </h1>
              <p className="text-muted-foreground font-medium">
                Acompanhe o histórico e status das suas faturas
              </p>
            </div>
            <InvoicePdfExportButton
              selectedInvoice={selectedInvoice ?? null}
              filteredInvoices={filteredInvoices}
              invoices={invoices}
            />
          </div>

          {loading ? (
            <div className="text-center py-10 text-muted-foreground animate-pulse">
              A carregar faturas...
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-10 bg-card rounded-2xl border border-border/50">
              Nenhuma fatura encontrada. Use o seu cartão para gerar faturas!
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="relative min-w-[220px]">
                    <select
                      value={filterCard}
                      onChange={(e) => setFilterCard(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-card border border-border/50 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2B5BBA] transition-all appearance-none shadow-sm text-foreground"
                    >
                      <option value="all">Todos os Cartões</option>
                      {uniqueCards.map((cardName) => (
                        <option key={cardName} value={cardName}>
                          {cardName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollCards("left")}
                      className="p-2 bg-card border border-border/50 hover:bg-muted rounded-xl transition-all shadow-sm"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={() => scrollCards("right")}
                      className="p-2 bg-card border border-border/50 hover:bg-muted rounded-xl transition-all shadow-sm"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {filteredInvoices.length === 0 ? (
                  <div className="text-center py-10 bg-card/50 rounded-2xl border border-border/30">
                    <p className="text-muted-foreground">
                      Nenhuma fatura encontrada para este cartão.
                    </p>
                  </div>
                ) : (
                  <div
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex overflow-x-auto hide-scrollbar gap-6 py-6 px-4 -mx-4 transition-all ${
                      isDragging ? "cursor-grabbing select-none" : "cursor-grab"
                    }`}
                  >
                    {filteredInvoices.map((invoice) => {
                      const dateObj = new Date(invoice.dataVencimento);
                      dateObj.setMinutes(
                        dateObj.getMinutes() + dateObj.getTimezoneOffset(),
                      );

                      return (
                        <div
                          key={invoice.id}
                          className="min-w-[300px] shrink-0"
                        >
                          <InvoiceCard
                            cardName={
                              invoice.cartaoCredito.nome || "Cartão de Crédito"
                            }
                            month={monthNames[invoice.mes - 1]}
                            year={invoice.ano}
                            status={getStatus(invoice)}
                            dueDate={dateObj.toLocaleDateString("pt-BR")}
                            totalAmount={invoice.valorTotal}
                            purchasesCount={invoice.parcelas.length}
                            isActive={selectedInvoiceId === invoice.id}
                            onClick={() => setSelectedInvoiceId(invoice.id)}
                          />
                        </div>
                      );
                    })}
                    <div className="w-1 shrink-0" aria-hidden="true"></div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                {selectedInvoice && (
                  <>
                    {!selectedInvoice.estaPaga && (
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={() => setIsPayModalOpen(true)}
                          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
                        >
                          <CheckCircle size={18} />
                          Pagar Fatura
                        </button>
                      </div>
                    )}
                    <InvoiceTable
                      month={monthNames[selectedInvoice.mes - 1]}
                      year={selectedInvoice.ano}
                      items={tableItems}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>

      {isPayModalOpen && selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="relative bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-md border border-border/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
              <h2 className="text-xl font-bold">Pagar Fatura</h2>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePayInvoice} className="p-6 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Você está prestes a pagar a fatura de{" "}
                  <strong>
                    {monthNames[selectedInvoice.mes - 1]} {selectedInvoice.ano}
                  </strong>{" "}
                  no valor de{" "}
                  <strong className="text-foreground">
                    {selectedInvoice.valorTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                  .
                </p>

                <label className="block text-sm font-medium mb-2">
                  Conta de Origem
                </label>
                <select
                  value={selectedContaId}
                  onChange={(e) => setSelectedContaId(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:ring-2 focus:ring-[#2B5BBA] outline-none transition-all"
                  required
                >
                  <option value="">Selecione a conta para débito</option>
                  {contas.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.nome} (Saldo:{" "}
                      {c.saldo.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                      )
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="flex-1 py-3 bg-muted rounded-xl font-bold hover:bg-muted/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPaying || !selectedContaId}
                  className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 disabled:opacity-70 transition-all shadow-md shadow-emerald-500/20"
                >
                  {isPaying ? "Processando..." : "Confirmar Pagamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
