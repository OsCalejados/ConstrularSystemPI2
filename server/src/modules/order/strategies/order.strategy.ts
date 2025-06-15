import { BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderItemDto } from '../dtos/order-item.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

export abstract class OrderStrategy {
  abstract validateCreate(order: CreateOrderDto): void;
  abstract validateUpdate(order: UpdateOrderDto): void;

  abstract applyBusinessRulesOnCreate(order: CreateOrderDto): void;
  abstract applyBusinessRulesOnUpdate(order: UpdateOrderDto): void;

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

    if (itemsTotal !== Number(order.total)) {
      throw new BadRequestException(
        `Order total (${order.total}) does not match sum of item totals (${itemsTotal})`,
      );
    }

    if (order.discount < 0) {
      throw new BadRequestException('Discount cannot be negative');
    }

    if (order.discount > order.total) {
      throw new BadRequestException(
        'Discount cannot be greater than total order amount',
      );
    }
  }

  protected validatePayments(order: CreateOrderDto | UpdateOrderDto) {
    // order.payments.forEach((payment) => {
    //   if (payment.amount <= 0) {
    //     throw new BadRequestException(
    //       'Payment amount must be greater than zero',
    //     );
    //   }
    //   if (new Date(payment.paidAt) < new Date(order.createdAt || new Date())) {
    //     throw new BadRequestException(
    //       'Payment date cannot be before order creation date',
    //     );
    //   }
    // });
  }
}
