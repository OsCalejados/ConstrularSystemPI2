import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PaymentService } from '../services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.createPayment(createPaymentDto);
  }

  @Delete(':id')
  async deletePayment(@Param('id') paymentId: string) {
    const id = parseInt(paymentId);

    await this.paymentService.deletePayment(id);
  }
}
