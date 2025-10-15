/*
  Warnings:

  - A unique constraint covering the columns `[usuarioId,categoriaId,mes,ano]` on the table `Orcamento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Orcamento_usuarioId_categoriaId_mes_ano_key" ON "Orcamento"("usuarioId", "categoriaId", "mes", "ano");
