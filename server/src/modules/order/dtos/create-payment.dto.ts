import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PaymentMethod } from '@src/common/enums/payment-method.enum';

export class CreatePaymentDto {
  @IsNotEmpty()
  orderId: number;

  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  change: number;

  @IsOptional()
  installments: number;
}
