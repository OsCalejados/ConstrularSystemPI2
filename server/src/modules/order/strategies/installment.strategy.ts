import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderStrategy } from './order.strategy';
import { OrderStatus } from '@src/common/enums/order-status.enum';

export class InstallmentOrderStrategy extends OrderStrategy {
  validateCreate(order: CreateOrderDto) {
    this.validateItems(order.items);
  }

  validateUpdate(order: UpdateOrderDto) {
    this.validateItems(order.items);
  }

  applyBusinessRulesOnCreate(order: CreateOrderDto): void {
    order.status = OrderStatus.OPEN;
    order.paid = false;
  }

  applyBusinessRulesOnUpdate(order: UpdateOrderDto): void {
    order.status = OrderStatus.OPEN;
    order.paid = false;
  }
}
