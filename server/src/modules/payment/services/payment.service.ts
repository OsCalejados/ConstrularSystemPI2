import { PaymentRepository } from '../repositories/payment.repository';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private orderService: IOrderService,
  ) {}

  async createPayment(payment: CreatePaymentDto) {
    const order = this.orderService.getOrderById(payment.orderId);

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
