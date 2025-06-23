import { Product, StockMovement, StockMovementItem } from '@prisma/client';

/**
 * Representa um StockMovement com seus itens associados,
 * e para cada item, o seu respectivo produto.
 * É um tipo útil para queries do Prisma que usam `include`.
 */
export type StockMovementWithDetails = StockMovement & {
  items: (StockMovementItem & {
    product: Product;
  })[];
};

export type StockMovementItemWithProduct = StockMovementItem & {
  product: Product;
};
