-- AlterTable
ALTER TABLE "CartaoCredito" ADD COLUMN     "ultimosDigitos" TEXT;

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "observacoes" TEXT;

-- AlterTable
ALTER TABLE "Conta" ADD COLUMN     "agencia" TEXT,
ADD COLUMN     "numeroConta" TEXT;

-- AlterTable
ALTER TABLE "Transacao" ADD COLUMN     "observacoes" TEXT;
