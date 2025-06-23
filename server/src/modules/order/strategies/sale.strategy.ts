import { IOrderRepository } from '../interfaces/order.repository.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderStrategy } from './order.strategy';
import { OrderType } from '@src/common/enums/order-type.enum';
import { OrderDto } from '../dtos/order.dto';

export class SaleOrderStrategy extends OrderStrategy {
  type = OrderType.SALE;

  constructor(private readonly orderRepository: IOrderRepository) {
    super();
  }

  async createOrder(dto: CreateOrderDto, sellerId: number): Promise<OrderDto> {
    console.log(dto);
    console.log(sellerId);
    throw new Error('Method not implemented.');
  }

  async updateOrder(orderId: number, dto: UpdateOrderDto): Promise<OrderDto> {
    console.log(dto);
    console.log(orderId);
    throw new Error('Method not implemented.');
  }

  async deleteOrder(orderId: number): Promise<void> {
    console.log(orderId);
    throw new Error('Method not implemented.');
  }
}
