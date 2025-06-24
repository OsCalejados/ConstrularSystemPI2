import { Prisma, StockMovement } from '@prisma/client';
import { StockMovementWithDetails } from '../types/stock_movement.types';
import { MovementType } from '@src/common/enums/movement_type.enum';
import { CreateStockMovementDTO } from '../dtos/create_stock_movement.dto';

export interface IStockMovementRepository {
  findAll(type?: MovementType): Promise<StockMovement[]>;
  findById(stockMovementId: number): Promise<StockMovementWithDetails | null>;
  create(
    data: CreateStockMovementDTO,
    tx?: Prisma.TransactionClient,
  ): Promise<StockMovementWithDetails>;
  delete(stockMovementId: number): Promise<StockMovement>;
}
