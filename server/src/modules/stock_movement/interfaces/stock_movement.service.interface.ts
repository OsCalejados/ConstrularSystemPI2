import { CreateStockMovementDTO } from '../dtos/create_stock_movement.dto';
import { StockMovementDTO } from '../dtos/stock_movement.dto';

export interface IStockMovementService {
  getAllStockMovements(): Promise<StockMovementDTO[]>;
  getStockMovementById(
    stockMovementId: number,
  ): Promise<StockMovementDTO | null>;
  createStockMovement(data: CreateStockMovementDTO): Promise<StockMovementDTO>;
  deleteStockMovement(stockMovementId: number): Promise<void>;
}
