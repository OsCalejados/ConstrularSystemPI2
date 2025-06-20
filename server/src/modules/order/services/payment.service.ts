import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaymentRepository } from '../interfaces/payment.repository.interface';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: IPaymentRepository,
    private orderService: IOrderService,
  ) {}

  async getByOrder(orderId: number) {
    const order = this.orderService.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return await this.paymentRepository.findByOrder(orderId);
  }

  async createPayment(payment: CreatePaymentDto) {
    const order = this.orderService.getOrderById(payment.orderId);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return await this.paymentRepository.create(payment);
  }

  async deletePayment(paymentId: number) {
    const payment = await this.paymentRepository.findById(paymentId);

    if (!payment) {
      throw new NotFoundException(`Payment not found`);
    }

    await this.paymentRepository.deleteById(paymentId);
  }
}
