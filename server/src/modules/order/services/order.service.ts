import { FindOrderOptions } from '../interfaces/find-order-options.interface';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { CustomerService } from '@src/modules/customer/services/customer.service';
import { UpdateStatusDto } from '../dtos/update-status';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { UpdateNotesDto } from '../dtos/update-notes';
import { IOrderService } from '../interfaces/order.service.interface';
import { OrderStrategy } from '../strategies/order.strategy';
import { OrderDto } from '../dtos/order.dto';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { CreatePaymentDto } from '../dtos/create-payment.dto';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject('ORDER_STRATEGIES')
    private readonly strategies: OrderStrategy[],
    private readonly orderRepository: IOrderRepository,
    private readonly customerService: CustomerService,
  ) {}

  async getAllOrders(options?: FindOrderOptions): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findAll(options);

    return orders;
  }

  async getOrderById(
    orderId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto> {
    const order = await this.orderRepository.findById(orderId, options);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return order;
  }

  async getOrdersByCustomer(
    customerId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto[]> {
    const costumer = this.customerService.getCustomerById(customerId);

    if (!costumer) {
      throw new NotFoundException(`Customer not found`);
    }

    return await this.orderRepository.findByCustomer(customerId, options);
  }

  async getOrdersByProductId(
    productId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findByProductId(
      productId,
      options,
    );

    return orders;
  }

  async createOrder(
    order: CreateOrderDto,
    sellerId: number,
  ): Promise<OrderDto> {
    const strategy = this.strategies.find((s) => s.type === order.type);

    if (!strategy) {
      throw new BadRequestException(`Invalid order type: ${order.type}`);
    }

    const createdOrder = strategy.createOrder(order, sellerId);

    return createdOrder;
  }

  async updateOrder(orderId: number, order: UpdateOrderDto): Promise<OrderDto> {
    const strategy = this.strategies.find((s) => s.type === order.type);

    if (!strategy) {
      throw new BadRequestException(`Invalid order type: ${order.type}`);
    }

    const updatedOrder = strategy.updateOrder(orderId, order);

    return updatedOrder;
  }

  async updateNotes(
    orderId: number,
    updateStatusDto: UpdateNotesDto,
  ): Promise<OrderDto> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new NotFoundException(`Order not found`);
    }

    const updatedOrder = await this.orderRepository.updateNotes(
      orderId,
      updateStatusDto,
    );

    return updatedOrder;
  }

  async updateStatus(
    orderId: number,
    updateStatusDto: UpdateStatusDto,
  ): Promise<OrderDto> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new NotFoundException(`Order not found`);
    }

    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      updateStatusDto,
    );

    return updatedOrder;
  }

  async addPayment(
    orderId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    await this.orderRepository.addPayment(orderId, createPaymentDto);
  }

  async deleteOrder(orderId: number): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    await this.orderRepository.deleteById(orderId);
  }
}
