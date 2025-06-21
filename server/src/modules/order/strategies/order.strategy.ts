import { BadRequestException } from '@nestjs/common';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderItemDto } from '../dtos/order-item.dto';
import { OrderType } from '@src/common/enums/order-type.enum';
import { OrderDto } from '../dtos/order.dto';

export abstract class OrderStrategy {
  type: OrderType;

  abstract createOrder(
    dto: CreateOrderDto,
    sellerId: number,
  ): Promise<OrderDto>;

  abstract updateOrder(orderId: number, dto: UpdateOrderDto): Promise<OrderDto>;

  protected validateItems(items: OrderItemDto[]) {
    if (!items || items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    items.forEach((item) => {
      if (item.quantity <= 0) {
        throw new BadRequestException(
          `Item quantity must be greater than zero`,
        );
      }
      if (item.unitPrice <= 0) {
        throw new BadRequestException(
          `Item unit price must be greater than zero`,
        );
      }
      if (item.total <= 0) {
        throw new BadRequestException(`Item total must be greater than zero`);
      }

      const expectedTotal = Number(item.unitPrice) * Number(item.quantity);
      if (Number(item.total) !== expectedTotal) {
        throw new BadRequestException(
          `Item total (${item.total}) does not match quantity * unitPrice (${expectedTotal})`,
        );
      }
    });
  }

  protected validateOrderTotals(order: CreateOrderDto | UpdateOrderDto): void {
    const itemsTotal = order.items.reduce(
      (acc, item) => acc + Number(item.total),
      0,
    );

    if (itemsTotal !== Number(order.subtotal)) {
      throw new BadRequestException(
        `Order total (${order.total}) does not match sum of item totals (${itemsTotal})`,
      );
    }

    if (order.discount < 0) {
      throw new BadRequestException('Discount cannot be negative');
    }

    if (order.discount > order.subtotal) {
      throw new BadRequestException(
        'Discount cannot be greater than total order amount',
      );
    }
  }
}
