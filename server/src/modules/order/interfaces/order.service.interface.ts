import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateNotesDto } from '../dtos/update-notes';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderDto } from '../dtos/order.dto';
import { FindOrderOptions } from './find-order-options.interface';

export abstract class IOrderService {
  abstract getAllOrders(options?: FindOrderOptions): Promise<OrderDto[]>;

  abstract getOrderById(
    orderId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto>;

  abstract getOrdersByProductId(
    productId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto[]>;

  abstract getOrdersByCustomer(
    customerId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto[]>;

  abstract createOrder(
    order: CreateOrderDto,
    sellerId: number,
  ): Promise<OrderDto>;

  abstract updateOrder(
    orderId: number,
    order: UpdateOrderDto,
  ): Promise<OrderDto>;

  abstract updateNotes(
    orderId: number,
    updateNotesDto: UpdateNotesDto,
  ): Promise<OrderDto>;

  abstract updateStatus(
    orderId: number,
    updateStatusDto: UpdateStatusDto,
  ): Promise<OrderDto>;

  abstract deleteOrder(orderId: number): Promise<void>;
}
