import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderStrategy } from './order.strategy';

export class QuoteOrderStrategy extends OrderStrategy {
  applyBusinessRulesOnCreate(order: CreateOrderDto): void {
    throw new Error('Method not implemented.');
  }

  applyBusinessRulesOnUpdate(order: UpdateOrderDto): void {
    throw new Error('Method not implemented.');
  }

  validateCreate(order: CreateOrderDto) {
    this.validateItems(order.items);
  }

  validateUpdate(order: UpdateOrderDto) {
    this.validateItems(order.items);
  }
}
