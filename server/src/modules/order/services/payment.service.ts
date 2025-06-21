import { IPaymentRepository } from '../interfaces/payment.repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(private paymentRepository: IPaymentRepository) {}

  async getById(paymentId: number) {
    const payment = await this.paymentRepository.findById(paymentId);

    return payment;
  }
}
