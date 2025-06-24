import { CreateStockMovementDTO } from '../dtos/create_stock_movement.dto';
import { StockMovementDTO } from '../dtos/stock_movement.dto';
import { MovementType } from '@src/common/enums/movement_type.enum';

export interface IStockMovementService {
  getAllStockMovements(type?: MovementType): Promise<StockMovementDTO[]>;
  getStockMovementById(
    stockMovementId: number,
  ): Promise<StockMovementDTO | null>;
  createStockMovement(data: CreateStockMovementDTO): Promise<StockMovementDTO>;
  deleteStockMovement(stockMovementId: number): Promise<void>;
}
