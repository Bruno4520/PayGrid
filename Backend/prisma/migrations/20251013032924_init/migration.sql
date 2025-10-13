/*
  Warnings:

  - A unique constraint covering the columns `[cartaoCreditoId,mes,ano]` on the table `Fatura` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fatura_cartaoCreditoId_mes_ano_key" ON "Fatura"("cartaoCreditoId", "mes", "ano");
