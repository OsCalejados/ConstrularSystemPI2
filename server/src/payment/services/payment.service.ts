import { OrderRepository } from 'src/order/repositories/order.repository';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PaymentRepository } from '../repositories/payment.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private orderRepository: OrderRepository,
  ) {}

  async createPayment(payment: CreatePaymentDto) {
    const order = this.orderRepository.findById(payment.orderId);

    if (!order) {
      throw new Error(`Order not found`);
    }

    const createdPayment = await this.paymentRepository.create(payment);

    return createdPayment;
  }

  async deletePayment(paymentId: number) {
    const payment = await this.paymentRepository.findById(paymentId);

    if (!payment) {
      throw new Error(`Payment not found`);
    }

    await this.paymentRepository.delete(paymentId);
  }
}
