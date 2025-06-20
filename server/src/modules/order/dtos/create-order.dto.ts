import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { OrderType } from 'src/common/enums/order-type.enum';
import { OrderPaymentDto } from './order-payment.dto';

export class CreateOrderDto {
  total: number;

  subtotal: number;

  discount: number;

  notes: string;

  customerId: number;

  @IsEnum(OrderType)
  type: OrderType;

  @IsNotEmpty()
  items: OrderItemDto[];

  @IsOptional()
  payments: OrderPaymentDto[];
}
