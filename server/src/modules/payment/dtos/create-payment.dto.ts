import { IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  value: number;

  @IsNotEmpty()
  orderId: number;
}
