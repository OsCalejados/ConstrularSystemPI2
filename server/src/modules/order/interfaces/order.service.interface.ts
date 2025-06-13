import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateNotesDto } from '../dtos/update-notes';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderDto } from '../dtos/order.dto';

export abstract class IOrderService {
  abstract getAllOrders(): Promise<OrderDto[]>;

  abstract getOrderById(orderId: number): Promise<OrderDto>;

  abstract getOrdersByProductId(productId: number): Promise<OrderDto[]>;

  abstract getOrdersByCustomer(
    customerId: number,
    page?: number,
    pageSize?: number,
    status?: string,
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
