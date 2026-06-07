-- CreateEnum
CREATE TYPE "TipoConta" AS ENUM ('CARTEIRA', 'CONTA_CORRENTE', 'POUPANCA');

-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('RECEITA', 'DESPESA');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DEBITO', 'CREDITO', 'PIX', 'DINHEIRO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conta" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoConta" NOT NULL,
    "numeroConta" TEXT NOT NULL,
    "agencia" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "observacoes" TEXT,
    "icone" TEXT,
    "cor" TEXT,
    "sistema" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orcamento" (
    "id" SERIAL NOT NULL,
    "valorPlanejado" DOUBLE PRECISION NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "Orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transacao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" "TipoTransacao" NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "observacoes" TEXT,
    "contaId" INTEGER,
    "categoriaId" INTEGER,
    "cartaoCreditoId" INTEGER,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartaoCredito" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "limite" DOUBLE PRECISION NOT NULL,
    "diaFechamentoFatura" INTEGER NOT NULL,
    "diaVencimentoFatura" INTEGER NOT NULL,
    "ultimosDigitos" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "CartaoCredito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fatura" (
    "id" SERIAL NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "estaPaga" BOOLEAN NOT NULL DEFAULT false,
    "cartaoCreditoId" INTEGER NOT NULL,
    "transacaoPagamentoId" INTEGER,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcela" (
    "id" SERIAL NOT NULL,
    "numeroParcela" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "transacaoId" INTEGER NOT NULL,
    "faturaId" INTEGER NOT NULL,

    CONSTRAINT "Parcela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valorInicial" DOUBLE PRECISION NOT NULL,
    "aporteMensal" DOUBLE PRECISION NOT NULL,
    "taxaMensal" DOUBLE PRECISION NOT NULL,
    "periodoMensal" INTEGER NOT NULL,
    "dataSimulacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorFinalBruto" DOUBLE PRECISION NOT NULL,
    "valorImposto" DOUBLE PRECISION NOT NULL,
    "valorFinalLiquido" DOUBLE PRECISION NOT NULL,
    "totalInvestido" DOUBLE PRECISION NOT NULL,
    "ganhoLiquido" DOUBLE PRECISION NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Simulacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_usuarioId_key" ON "Categoria"("nome", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Orcamento_usuarioId_categoriaId_mes_ano_key" ON "Orcamento"("usuarioId", "categoriaId", "mes", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "Fatura_transacaoPagamentoId_key" ON "Fatura"("transacaoPagamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "Fatura_cartaoCreditoId_mes_ano_key" ON "Fatura"("cartaoCreditoId", "mes", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "Parcela_transacaoId_numeroParcela_key" ON "Parcela"("transacaoId", "numeroParcela");

-- AddForeignKey
ALTER TABLE "Conta" ADD CONSTRAINT "Conta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orcamento" ADD CONSTRAINT "Orcamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orcamento" ADD CONSTRAINT "Orcamento_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "Conta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_cartaoCreditoId_fkey" FOREIGN KEY ("cartaoCreditoId") REFERENCES "CartaoCredito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartaoCredito" ADD CONSTRAINT "CartaoCredito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_cartaoCreditoId_fkey" FOREIGN KEY ("cartaoCreditoId") REFERENCES "CartaoCredito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_transacaoPagamentoId_fkey" FOREIGN KEY ("transacaoPagamentoId") REFERENCES "Transacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcela" ADD CONSTRAINT "Parcela_transacaoId_fkey" FOREIGN KEY ("transacaoId") REFERENCES "Transacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcela" ADD CONSTRAINT "Parcela_faturaId_fkey" FOREIGN KEY ("faturaId") REFERENCES "Fatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulacao" ADD CONSTRAINT "Simulacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
