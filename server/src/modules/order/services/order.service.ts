import { CustomerRepository } from '@src/modules/customer/interfaces/customer.repository.interface';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { UpdateStatusDto } from '../dtos/update-status';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { UpdateNotesDto } from '../dtos/update-notes';
import { IOrderService } from '../interfaces/order.service.interface';
import { Injectable } from '@nestjs/common';
import { OrderDto } from '../dtos/order.dto';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async getAllOrders(): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findAll();

    return orders;
  }

  async getOrderById(orderId: number): Promise<OrderDto> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order not found`);
    }

    return order;
  }

  async getOrdersByCustomer(customerId: number): Promise<OrderDto[]> {
    const costumer = this.customerRepository.findById(customerId);

    if (!costumer) {
      throw new Error(`Customer not found`);
    }

    return await this.orderRepository.findByCustomer(customerId);
  }

  async getOrdersByProductId(productId: number): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findByProductId(productId);

    return orders;
  }

  async createOrder(
    order: CreateOrderDto,
    sellerId: number,
  ): Promise<OrderDto> {
    const costumer = this.customerRepository.findById(order.customerId);

    if (!costumer) {
      throw new Error(`Customer not found`);
    }

    const createdOrder = await this.orderRepository.create(order, sellerId);

    return createdOrder;
  }

  async updateOrder(orderId: number, order: UpdateOrderDto): Promise<OrderDto> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new Error(`Order not found`);
    }

    const updatedOrder = await this.orderRepository.update(orderId, order);

    return updatedOrder;
  }

  async updateNotes(
    orderId: number,
    updateStatusDto: UpdateNotesDto,
  ): Promise<OrderDto> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new Error(`Order not found`);
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
      throw new Error(`Order not found`);
    }

    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      updateStatusDto,
    );

    return updatedOrder;
  }

  async deleteOrder(orderId: number): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order not found`);
    }

    await this.orderRepository.deleteById(orderId);
  }
}
