import { InstallmentOrderStrategy } from '../strategies/installment.strategy';
import { CustomerRepository } from '@src/modules/customer/interfaces/customer.repository.interface';
import { QuoteOrderStrategy } from '../strategies/quote.strategy';
import { SaleOrderStrategy } from '../strategies/sale.strategy';
import { FindOrderOptions } from '../interfaces/find-order-options.interface';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { UpdateStatusDto } from '../dtos/update-status';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { UpdateNotesDto } from '../dtos/update-notes';
import { IOrderService } from '../interfaces/order.service.interface';
import { OrderStrategy } from '../strategies/order.strategy';
import { OrderType } from '@src/common/enums/order-type.enum';
import { OrderDto } from '../dtos/order.dto';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private customerRepository: CustomerRepository,
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
    const costumer = this.customerRepository.findById(customerId);

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
    const costumer = this.customerRepository.findById(order.customerId);

    if (!costumer) {
      throw new NotFoundException(`Customer not found`);
    }

    const strategy = this.getStrategy(order.type);

    strategy.validateCreate(order);
    strategy.applyBusinessRulesOnCreate(order);

    const createdOrder = await this.orderRepository.create(order, sellerId);

    return createdOrder;
  }

  async updateOrder(orderId: number, order: UpdateOrderDto): Promise<OrderDto> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new NotFoundException(`Order not found`);
    }

    const strategy = this.getStrategy(order.type);

    strategy.validateUpdate(order);
    strategy.applyBusinessRulesOnUpdate(order);

    const updatedOrder = await this.orderRepository.update(orderId, order);

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

  async deleteOrder(orderId: number): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    await this.orderRepository.deleteById(orderId);
  }

  private getStrategy(type: OrderType): OrderStrategy {
    switch (type) {
      case OrderType.INSTALLMENT:
        return new InstallmentOrderStrategy();
      case OrderType.QUOTE:
        return new QuoteOrderStrategy();
      case OrderType.SALE:
        return new SaleOrderStrategy();
      default:
        throw new BadRequestException(`Invalid order type`);
    }
  }
}
