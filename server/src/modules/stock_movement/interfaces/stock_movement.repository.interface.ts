import { Prisma, StockMovement } from '@prisma/client';
import { StockMovementWithDetails } from '../types/stock_movement.types';

export interface IStockMovementRepository {
  findAll(): Promise<StockMovement[]>;
  findById(stockMovementId: number): Promise<StockMovementWithDetails | null>;
  create(
    data: Prisma.StockMovementCreateInput,
  ): Promise<StockMovementWithDetails>;
  delete(stockMovementId: number): Promise<StockMovement>;
}
