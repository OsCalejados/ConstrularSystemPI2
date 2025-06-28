import { StockMovementDTO } from '../dtos/stock_movement.dto';

import { StockMovementWithDetails } from '../types/stock_movement.types';
import { StockMovementItemMapper } from './stock_movement_item.mapper';

export class StockMovementMapper {
  static toDto(stockMovement: StockMovementWithDetails): StockMovementDTO {
    return {
      id: stockMovement.id,
      type: stockMovement.type,
      description: stockMovement.description,
      createdAt: stockMovement.createdAt,
      items: stockMovement.items.map((item) => {
        return StockMovementItemMapper.toDto(item);
      }),
    };
  }
}
