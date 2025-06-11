import { OrderRepository } from '../repositories/order.repository';
import { CustomerRepository } from '@src/modules/customer/interfaces/customer.repository.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Injectable } from '@nestjs/common';
import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateNotesDto } from '../dtos/update-notes';
import { IOrderService } from '../interfaces/order.service.interface';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
  ) {}
  async getOrdersByProductId(productId: number): Promise<Order[]> {
    // TODO
    //find order_item by productId
    // then find order by order_item.orderId
    // if not find return empty array
    // else return orders
    return [];
    const ordersItems =
      await this.orderRepository.findOrderItemByProduct(productId);
    if (!ordersItems || ordersItems.length === 0) {
      return [];
    }
    const orderIds = ordersItems.map((item) => item.orderId);
    return Promise.all(
      orderIds.map((orderId) => this.orderRepository.findById(orderId)),
    );
  }

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
