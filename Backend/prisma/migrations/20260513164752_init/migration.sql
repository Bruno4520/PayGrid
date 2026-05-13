-- AlterTable
ALTER TABLE "CartaoCredito" ALTER COLUMN "ultimosDigitos" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Conta" ALTER COLUMN "numeroConta" DROP NOT NULL,
ALTER COLUMN "agencia" DROP NOT NULL;
