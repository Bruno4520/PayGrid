import { Download } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoicePdfExportButtonProps {
  invoice: FaturaPdfData | null | undefined;
  monthNames: string[];
}

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

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount || 0);
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

const sanitizeFileName = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
};

export function InvoicePdfExportButton({
  invoice,
  monthNames,
}: InvoicePdfExportButtonProps) {
  const handleExport = () => {
    if (!invoice) {
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

      const monthName = monthNames[invoice.mes - 1] || "Mês";
      const competence = monthName + " " + invoice.ano;
      const cardName = invoice.cartaoCredito.nome || "Cartão de Crédito";
      const invoiceItems = invoice.parcelas || [];
      const invoiceStatus = getInvoicePdfStatus(invoice);

      const purchaseRows = invoiceItems.map((parcela) => {
        const transacao = parcela.transacao;
        const totalParcels = transacao.numeroParcelas || 1;
        const installmentLabel =
          totalParcels > 1
            ? parcela.numeroParcela + "/" + totalParcels
            : "À vista";

        return {
          data: formatDate(transacao.data),
          descricao: transacao.descricao || "Compra sem descrição",
          categoria: transacao.categoria?.nome || "Sem categoria",
          parcela: installmentLabel,
          valor: Number(parcela.valor || 0),
        };
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
        doc.text("Relatório da Fatura", margin, 58);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(
          "Competência: " + competence + " | Cartão: " + cardName,
          margin,
          65,
          { maxWidth: contentWidth },
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
        doc.text(value, x + 4, y + 15, { maxWidth: width - 8 });

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
          doc.text(subtitle, margin, y + 5, { maxWidth: contentWidth });
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
        "Valor da fatura",
        formatCurrency(invoice.valorTotal),
        invoiceStatus,
      );

      drawMetricCard(
        margin + cardWidth + 4,
        76,
        cardWidth,
        "Vencimento",
        formatDate(invoice.dataVencimento),
        competence,
      );

      drawMetricCard(
        margin + (cardWidth + 4) * 2,
        76,
        cardWidth,
        "Cartão",
        cardName,
        "Fatura selecionada",
      );

      drawMetricCard(
        margin + (cardWidth + 4) * 3,
        76,
        cardWidth,
        "Lançamentos",
        String(invoiceItems.length),
        "Compras/parcelas",
      );

      drawSection(
        "Dados da fatura",
        "Resumo individual da fatura selecionada na tela.",
        115,
      );

      autoTable(doc, {
        startY: 123,
        head: [["Competência", "Cartão", "Vencimento", "Status", "Valor", "Compras"]],
        body: [[
          competence,
          cardName,
          formatDate(invoice.dataVencimento),
          invoiceStatus,
          formatCurrency(invoice.valorTotal),
          String(invoiceItems.length),
        ]],
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

      let currentY = getLastAutoTableY(doc, 145) + 14;
      currentY = ensureSpace(currentY, 70);

      drawSection(
        "Lançamentos da fatura",
        "Compras e parcelas que compõem somente a fatura selecionada.",
        currentY,
      );

      autoTable(doc, {
        startY: currentY + 8,
        head: [["Data", "Descrição", "Categoria", "Parcela", "Valor"]],
        body:
          purchaseRows.length > 0
            ? purchaseRows.map((item) => [
                item.data,
                item.descricao,
                item.categoria,
                item.parcela,
                formatCurrency(item.valor),
              ])
            : [["-", "Nenhuma compra encontrada", "-", "-", "-"]],
        foot: [["", "", "", "Total", formatCurrency(invoice.valorTotal)]],
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
          4: {
            halign: "right",
            fontStyle: "bold",
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

      const fileName = sanitizeFileName(
        "paygrid-fatura-" + cardName + "-" + monthName + "-" + invoice.ano,
      );

      doc.save(fileName + ".pdf");
      toast.success("PDF da fatura exportado com sucesso.");
    } catch (error) {
      toast.error("Não foi possível exportar o PDF da fatura.");
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={!invoice}
      className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3.5 rounded-xl border border-border/50 hover:bg-muted font-medium transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Download size={18} />
      Exportar fatura atual
    </button>
  );
}
