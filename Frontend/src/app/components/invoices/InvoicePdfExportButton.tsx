import { Download } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface FaturaPdfData {
  id: number;
  mes: number;
  ano: number;
  estaPaga: boolean;
  valorTotal: number;
  dataVencimento: string;
  cartaoCredito: {
    nome: string;
  };
  parcelas: any[];
}

interface InvoicePdfExportButtonProps {
  selectedInvoice: FaturaPdfData | null | undefined;
  filteredInvoices: FaturaPdfData[];
  invoices: FaturaPdfData[];
  monthNames: string[];
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

const getInvoicePdfStatus = (invoice: FaturaPdfData) => {
  if (invoice.estaPaga) return "Paga";

  const today = new Date();
  const dueDate = new Date(invoice.dataVencimento);
  const daysToDue =
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (daysToDue < 0) return "Vencida";
  if (daysToDue <= 7) return "Fechada";

  return "Aberta";
};

export function InvoicePdfExportButton({
  selectedInvoice,
  filteredInvoices,
  invoices,
  monthNames,
}: InvoicePdfExportButtonProps) {
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

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3.5 rounded-xl border border-border/50 hover:bg-muted font-medium transition-colors shadow-sm"
    >
      <Download size={18} />
      Exportar para o mês atual
    </button>
  );
}
