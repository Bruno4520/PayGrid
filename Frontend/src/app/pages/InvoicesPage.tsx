import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Download, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";
import { Footer } from "../components/dashboard/Footer";
import { InvoiceCard } from "../components/invoices/InvoiceCard";
import {
  InvoiceTable,
  type InvoiceItem,
} from "../components/invoices/InvoiceTable";
import { api } from "../../services/api";


import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
  return dateObj.toLocaleDateString("pt-BR");
};

const getLastAutoTableY = (doc: jsPDF, fallback: number) => {
  return (doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? fallback;
};

const getInvoicePdfStatus = (invoice: Fatura) => {
  if (invoice.estaPaga) return "Paga";

  const today = new Date();
  const dueDate = new Date(invoice.dataVencimento);
  const daysToDue =
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (daysToDue < 0) return "Vencida";
  if (daysToDue <= 7) return "Fechada";

  return "Aberta";
};

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

  const handleExport = () => {
    if (!selectedInvoice) {
      toast.error("Selecione uma fatura para exportar.");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      const generatedAt = new Date().toLocaleString("pt-BR");

      const invoicesToExport =
        filteredInvoices.length > 0 ? filteredInvoices : invoices;

      const competenceInvoices = invoicesToExport.filter(
        (invoice) =>
          invoice.mes === selectedInvoice.mes &&
          invoice.ano === selectedInvoice.ano,
      );

      const competence =
        monthNames[selectedInvoice.mes - 1] + " " + selectedInvoice.ano;

      const competenceTotal = competenceInvoices.reduce(
        (sum, invoice) => sum + invoice.valorTotal,
        0,
      );

      const openTotal = competenceInvoices
        .filter((invoice) => !invoice.estaPaga)
        .reduce((sum, invoice) => sum + invoice.valorTotal, 0);

      const paidTotal = competenceInvoices
        .filter((invoice) => invoice.estaPaga)
        .reduce((sum, invoice) => sum + invoice.valorTotal, 0);

      const purchaseCount = competenceInvoices.reduce(
        (sum, invoice) => sum + invoice.parcelas.length,
        0,
      );

      const cardCount = new Set(
        competenceInvoices.map((invoice) => invoice.cartaoCredito.nome),
      ).size;

      const competenceItems = competenceInvoices.flatMap((invoice) => {
        return (invoice.parcelas || []).map((parcela: any) => {
          const transacao =
            parcela.transacao ||
            parcela.transaction ||
            parcela.compra ||
            parcela.purchase ||
            {};

          const rawDate =
            transacao.data ||
            transacao.dataTransacao ||
            transacao.createdAt ||
            parcela.data ||
            parcela.dataCompra ||
            parcela.createdAt ||
            invoice.dataVencimento;

          const rawDescription =
            transacao.descricao ||
            transacao.description ||
            parcela.descricao ||
            parcela.description ||
            "Compra sem descrição";

          const rawCategory =
            transacao.categoria?.nome ||
            transacao.categoria?.name ||
            transacao.categoria ||
            parcela.categoria?.nome ||
            parcela.categoria?.name ||
            parcela.categoria ||
            "Sem categoria";

          const rawValue =
            parcela.valor ||
            parcela.valorParcela ||
            parcela.amount ||
            transacao.valor ||
            transacao.amount ||
            (invoice.parcelas.length === 1 ? invoice.valorTotal : 0);

          const installmentLabel =
            parcela.numeroParcela && parcela.totalParcelas
              ? parcela.numeroParcela + "/" + parcela.totalParcelas
              : parcela.parcelaAtual && parcela.totalParcelas
                ? parcela.parcelaAtual + "/" + parcela.totalParcelas
                : parcela.numero && parcela.total
                  ? parcela.numero + "/" + parcela.total
                  : "À vista";

          return {
            cartao: invoice.cartaoCredito.nome || "Cartão de Crédito",
            data: formatDate(String(rawDate)),
            descricao: String(rawDescription),
            categoria: String(rawCategory),
            parcela: installmentLabel,
            valor: Number(rawValue),
          };
        });
      });

      const drawHeader = () => {
        doc.setFillColor(10, 18, 32);
        doc.rect(0, 0, pageWidth, 45, "F");

        doc.setFillColor(43, 91, 186);
        doc.roundedRect(margin, 10, 14, 14, 3, 3, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(21);
        doc.text("PayGrid", margin + 21, 17);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Sistema para Gestão Financeira Pessoal", margin + 21, 25);

        doc.setFontSize(9);
        doc.text("Gerado em " + generatedAt, pageWidth - margin, 17, {
          align: "right",
        });

        doc.setFillColor(43, 91, 186);
        doc.rect(margin, 38, contentWidth, 1.4, "F");
      };

      const drawTitle = () => {
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(17);
        doc.text("Relatório Financeiro de Faturas", margin, 58);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(
          "Competência: " +
            competence +
            " | Consolidação de cartões, compras e vencimentos.",
          margin,
          65,
        );
      };

      const drawMetricCard = (
        x: number,
        y: number,
        width: number,
        title: string,
        value: string,
        subtitle: string,
      ) => {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(x, y, width, 25, 4, 4, "FD");

        doc.setTextColor(71, 85, 105);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.text(title.toUpperCase(), x + 4, y + 7);

        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(value, x + 4, y + 15);

        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(subtitle, x + 4, y + 21, {
          maxWidth: width - 8,
        });
      };

      const drawSection = (title: string, subtitle: string, y: number) => {
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12.5);
        doc.text(title, margin, y);

        if (subtitle) {
          doc.setTextColor(100, 116, 139);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.text(subtitle, margin, y + 5);
        }
      };

      const ensureSpace = (currentY: number, neededSpace: number) => {
        if (currentY + neededSpace > pageHeight - 22) {
          doc.addPage();
          return 24;
        }

        return currentY;
      };

      drawHeader();
      drawTitle();

      const cardWidth = (contentWidth - 12) / 4;

      drawMetricCard(
        margin,
        76,
        cardWidth,
        "Valor consolidado",
        formatCurrency(competenceTotal),
        competenceInvoices.length + " fatura(s)",
      );

      drawMetricCard(
        margin + cardWidth + 4,
        76,
        cardWidth,
        "Em aberto",
        formatCurrency(openTotal),
        "Pago: " + formatCurrency(paidTotal),
      );

      drawMetricCard(
        margin + (cardWidth + 4) * 2,
        76,
        cardWidth,
        "Cartões",
        String(cardCount),
        "Cartões com fatura no mês",
      );

      drawMetricCard(
        margin + (cardWidth + 4) * 3,
        76,
        cardWidth,
        "Lançamentos",
        String(purchaseCount),
        "Compras/parcelas",
      );

      drawSection(
        "Detalhamento por cartão",
        "Resumo das faturas vinculadas à competência selecionada.",
        115,
      );

      autoTable(doc, {
        startY: 123,
        head: [["Cartão", "Vencimento", "Status", "Valor da fatura", "Compras"]],
        body: competenceInvoices.map((invoice) => [
          invoice.cartaoCredito.nome || "Cartão de Crédito",
          formatDate(invoice.dataVencimento),
          getInvoicePdfStatus(invoice),
          formatCurrency(invoice.valorTotal),
          String(invoice.parcelas.length),
        ]),
        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 3,
          textColor: [15, 23, 42],
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [43, 91, 186],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          3: {
            halign: "right",
            fontStyle: "bold",
          },
          4: {
            halign: "center",
          },
        },
        margin: {
          left: margin,
          right: margin,
        },
      });

      let currentY = getLastAutoTableY(doc, 150) + 14;
      currentY = ensureSpace(currentY, 70);

      drawSection(
        "Lançamentos da competência",
        "Compras e parcelas que compõem o total consolidado do mês.",
        currentY,
      );

      autoTable(doc, {
        startY: currentY + 8,
        head: [["Cartão", "Data", "Descrição", "Categoria", "Parcela", "Valor"]],
        body:
          competenceItems.length > 0
            ? competenceItems.map((item) => [
                item.cartao,
                item.data,
                item.descricao,
                item.categoria,
                item.parcela,
                formatCurrency(item.valor),
              ])
            : [["-", "-", "Nenhuma compra encontrada", "-", "-", "-"]],
        foot: [["", "", "", "", "Total", formatCurrency(competenceTotal)]],
        styles: {
          font: "helvetica",
          fontSize: 7.8,
          cellPadding: 3,
          textColor: [15, 23, 42],
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [10, 18, 32],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        footStyles: {
          fillColor: [239, 246, 255],
          textColor: [15, 23, 42],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          5: {
            halign: "right",
            fontStyle: "bold",
          },
        },
        margin: {
          left: margin,
          right: margin,
        },
      });

      currentY = getLastAutoTableY(doc, currentY + 85) + 14;
      currentY = ensureSpace(currentY, 90);

      drawSection(
        "Agenda de vencimentos carregada na tela",
        "Visão de acompanhamento das faturas futuras exibidas no filtro atual.",
        currentY,
      );

      autoTable(doc, {
        startY: currentY + 8,
        head: [["Competência", "Cartão", "Vencimento", "Status", "Valor", "Compras"]],
        body: invoicesToExport.map((invoice) => [
          monthNames[invoice.mes - 1] + " " + invoice.ano,
          invoice.cartaoCredito.nome || "Cartão de Crédito",
          formatDate(invoice.dataVencimento),
          getInvoicePdfStatus(invoice),
          formatCurrency(invoice.valorTotal),
          String(invoice.parcelas.length),
        ]),
        styles: {
          font: "helvetica",
          fontSize: 7.5,
          cellPadding: 2.6,
          textColor: [15, 23, 42],
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [43, 91, 186],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          4: {
            halign: "right",
            fontStyle: "bold",
          },
          5: {
            halign: "center",
          },
        },
        margin: {
          left: margin,
          right: margin,
        },
      });

      const pageCount = doc.getNumberOfPages();

      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
        doc.setPage(pageNumber);

        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);

        doc.text(
          "PayGrid - Sistema para Gestão Financeira Pessoal",
          margin,
          pageHeight - 8,
        );

        doc.text(
          "Página " + pageNumber + " de " + pageCount,
          pageWidth - margin,
          pageHeight - 8,
          {
            align: "right",
          },
        );
      }

      const fileName = ("paygrid-relatorio-faturas-" + selectedInvoice.mes + "-" + selectedInvoice.ano)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .toLowerCase();

      doc.save(fileName + ".pdf");
      toast.success("PDF exportado com sucesso.");
    } catch (error) {
      toast.error("Não foi possível exportar o PDF.");
    }
  };


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
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3.5 rounded-xl border border-border/50 hover:bg-muted font-medium transition-colors shadow-sm"
            >
              <Download size={18} />
              Exportar
            </button>
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
