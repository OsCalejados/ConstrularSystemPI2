import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateNotesDto } from '../dtos/update-notes';
import { Order } from '@prisma/client';

export interface IOrderService {
  getAllOrders(): Promise<Order[]>;
  getOrderById(orderId: number): Promise<Order>;
  getOrdersByProductId(productId: number): Promise<Order[]>;
  getOrdersByCustomer(
    customerId: number,
    page?: number,
    pageSize?: number,
    status?: string,
  ): Promise<Order[]>;
  createOrder(order: CreateOrderDto): Promise<Order>;
  updateOrder(orderId: number, order: UpdateOrderDto): Promise<Order>;
  updateNotes(orderId: number, updateNotesDto: UpdateNotesDto): Promise<Order>;
  updateStatus(
    orderId: number,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Order>;
  deleteOrder(orderId: number): Promise<void>;
  deleteOrders(orderIds: number[]): Promise<void>;
}
