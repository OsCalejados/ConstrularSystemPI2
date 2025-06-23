import { StockMovementDTO } from '../dtos/stock_movement.dto';

import { StockMovementWithDetails } from '../types/stock_movement.types';

export class StockMovementMapper {
  static toDto(stockMovement: StockMovementWithDetails): StockMovementDTO {
    return {
      id: stockMovement.id,
      type: stockMovement.type,
      description: stockMovement.description,
      createdAt: stockMovement.createdAt,
      items: [],
      // stockMovement.stockMovementItems.map((item) => {
      //  return StockMovementItemMapper.toDto(item);
      // }),
    };
  }
}
