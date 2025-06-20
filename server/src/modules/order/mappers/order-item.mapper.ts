import { ProductMapper } from '@src/modules/product/mappers/product.mapper';
import { OrderItemDto } from '../dtos/order-item.dto';
import { OrderItem, Product } from '@prisma/client';

type OrderItemDetails = OrderItem & {
  product?: Product | null | undefined;
};

export class OrderItemMapper {
  static toDto(orderItem: OrderItemDetails): OrderItemDto {
    return {
      id: orderItem.id,
      productId: orderItem.productId,
      total: Number(orderItem.total),
      quantity: Number(orderItem.quantity),
      unitPrice: Number(orderItem.unitPrice),
      product: orderItem.product
        ? ProductMapper.toDto(orderItem.product)
        : undefined,
    };
  }
}
