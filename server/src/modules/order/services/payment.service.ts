import { IPaymentRepository } from '../interfaces/payment.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('IPaymentRepository')
    private paymentRepository: IPaymentRepository,
  ) {}

  async getById(paymentId: number) {
    const payment = await this.paymentRepository.findById(paymentId);

    return payment;
  }
}
