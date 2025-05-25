import { CustomerRepository } from 'src/customer/repositories/customer.repository';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Injectable } from '@nestjs/common';
import { ItemRepository } from 'src/item/repositories/item.repository';
import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateNotesDto } from '../dtos/update-notes';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private itemRepository: ItemRepository,
  ) {}

  async getAllOrders() {
    const orders = await this.orderRepository.findAll();

    return orders;
  }

  async getOrderById(orderId: number) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order not found`);
    }

    return order;
  }

  async getOrdersByCustomer(
    customerId: number,
    page: number = 1,
    pageSize: number = 12,
    status?: string,
  ) {
    const costumer = this.customerRepository.findById(customerId);

    if (!costumer) {
      throw new Error(`Customer not found`);
    }

    return await this.orderRepository.findByCustomer(
      customerId,
      page,
      pageSize,
      status,
    );
  }

  async createOrder(order: CreateOrderDto) {
    const costumer = this.customerRepository.findById(order.customerId);

    if (!costumer) {
      throw new Error(`Customer not found`);
    }

    const createdOrder = await this.orderRepository.create(order);

    return createdOrder;
  }

  async updateOrder(orderId: number, order: UpdateOrderDto) {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new Error(`Order not found`);
    }

    if (existingOrder.items) {
      await this.itemRepository.deleteMany(orderId);
    }

    const updatedOrder = await this.orderRepository.update(orderId, order);

    return updatedOrder;
  }

  async updateNotes(orderId: number, updateStatusDto: UpdateNotesDto) {
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

  async updateStatus(orderId: number, updateStatusDto: UpdateStatusDto) {
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

  async deleteOrder(orderId: number) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order not found`);
    }

    await this.orderRepository.delete(orderId);
  }

  async deleteOrders(orderIds: number[]) {
    for (const orderId of orderIds) {
      const existingOrder = await this.orderRepository.findById(orderId);

      if (!existingOrder) {
        throw new Error(`Order with ID ${orderId} not found`);
      }
    }

    await this.orderRepository.deleteMany(orderIds);
  }
}
