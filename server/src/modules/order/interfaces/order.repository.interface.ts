import { UpdateStatusDto } from '../dtos/update-status';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { UpdateNotesDto } from '../dtos/update-notes';
import { OrderDto } from '../dtos/order.dto';

type FindOrderOptions = {
  includeProducts?: boolean;
  includeCustomer?: boolean;
  includeSeller?: boolean;
};

export abstract class IOrderRepository {
  abstract findAll(): Promise<OrderDto[]>;

  abstract findById(
    orderId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto>;

  abstract create(order: CreateOrderDto, sellerId: number): Promise<OrderDto>;

  abstract update(orderId: number, order: UpdateOrderDto): Promise<OrderDto>;

  abstract updateNotes(
    orderId: number,
    updateStatusDto: UpdateNotesDto,
  ): Promise<OrderDto>;

  abstract updateStatus(
    orderId: number,
    updateStatusDto: UpdateStatusDto,
  ): Promise<OrderDto>;

  abstract deleteById(orderId: number): Promise<OrderDto>;
}
