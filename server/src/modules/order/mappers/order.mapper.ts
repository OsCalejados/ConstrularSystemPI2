import { Customer, Order, OrderItem, User } from '@prisma/client';
import { OrderItemMapper } from './order-item.mapper';
import { CustomerMapper } from '@src/modules/customer/mappers/customer.mapper';
import { OrderStatus } from '@src/common/enums/order-status.enum';
import { UserMapper } from '@src/modules/user/mappers/user.mapper';
import { OrderType } from '@src/common/enums/order-type.enum';
import { OrderDto } from '../dtos/order.dto';

type OrderDetails = Order & {
  customer?: Customer | null | undefined;
  items?: OrderItem[] | null | undefined;
  seller?: User | null | undefined;
};

export class OrderMapper {
  static toDto(order: OrderDetails): OrderDto {
    return {
      id: order.id,
      notes: order.notes,
      type: order.type as OrderType,
      status: order.status as OrderStatus,
      discount: Number(order.discount),
      paid: order.paid,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      createdAt: order.createdAt,
      customerId: order.customerId,
      sellerId: order.sellerId,
      seller: order.seller ? UserMapper.toDto(order.seller) : undefined,
      customer: order.customer
        ? CustomerMapper.toDto(order.customer)
        : undefined,
      items: order.items
        ? order.items.map((product) => OrderItemMapper.toDto(product))
        : undefined,
    };
  }
}
