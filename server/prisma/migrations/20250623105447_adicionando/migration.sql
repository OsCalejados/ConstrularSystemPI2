-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "amountPaid" DECIMAL(65,30),
ADD COLUMN     "installments" INTEGER,
ADD COLUMN     "paymentMethod" TEXT;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movement_items" (
    "id" SERIAL NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "stockMovementId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "stock_movement_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stock_movement_items" ADD CONSTRAINT "stock_movement_items_stockMovementId_fkey" FOREIGN KEY ("stockMovementId") REFERENCES "stock_movements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement_items" ADD CONSTRAINT "stock_movement_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
