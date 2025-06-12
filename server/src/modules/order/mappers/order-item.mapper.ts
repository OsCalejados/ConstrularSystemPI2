import { OrderItemDto } from '../dtos/order-item.dto';
import { OrderItem } from '@prisma/client';

export class OrderItemMapper {
  static toDto(orderItem: OrderItem): OrderItemDto {
    return {
      productId: orderItem.productId,
      total: Number(orderItem.total),
      quantity: Number(orderItem.quantity),
      unitPrice: Number(orderItem.unitPrice),
    };
  }
}
