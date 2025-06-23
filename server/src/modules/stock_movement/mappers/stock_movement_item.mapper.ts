import { ProductDto } from '@src/modules/product/dtos/product.dto';
import { StockMovementItemDTO } from '../dtos/stock_movement_item.dto';

import { StockMovementItemWithProduct } from '../types/stock_movement.types';

export class StockMovementItemMapper {
  static toDto(
    stockMovementItem: StockMovementItemWithProduct,
  ): StockMovementItemDTO {
    return {
      id: stockMovementItem.id,
      quantity: stockMovementItem.quantity.toNumber(),
      stockMovementId: stockMovementItem.stockMovementId,
      product: {
        id: stockMovementItem.product.id,
        name: stockMovementItem.product.name,
        brand: stockMovementItem.product.brand,
        unit: stockMovementItem.product.unit,
        stockQuantity: stockMovementItem.product.stockQuantity.toNumber(),
        costPrice: stockMovementItem.product.costPrice.toNumber(),
        profitMargin: stockMovementItem.product.profitMargin.toNumber(),
        profit: stockMovementItem.product.profit.toNumber(),
        salePrice: stockMovementItem.product.salePrice.toNumber(),
        createdAt: stockMovementItem.product.createdAt,
      } as ProductDto,
    };
  }
}
