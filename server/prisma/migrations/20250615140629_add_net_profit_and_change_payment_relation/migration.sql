/*
  Warnings:

  - You are about to drop the column `amountPaid` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `installments` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `orders` table. All the data in the column will be lost.
  - Added the required column `netTotal` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "amountPaid",
DROP COLUMN "installments",
DROP COLUMN "paymentMethod",
ADD COLUMN     "netTotal" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "order_payments" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "installments" INTEGER,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "order_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_payments" ADD CONSTRAINT "order_payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
