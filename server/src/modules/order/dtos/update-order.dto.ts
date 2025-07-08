import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { OrderType } from '@src/common/enums/order-type.enum';
import { UpdateOrderItemDto } from './update-order-item.dto';
import { UpdateOrderPaymentDto } from './update-order-payment.dto';

export class UpdateOrderDto {
  total: number;

  subtotal: number;

  discount: number;

  notes: string;

  customerId: number;

  @IsEnum(OrderType)
  type: OrderType;

  @IsNotEmpty()
  items: UpdateOrderItemDto[];

  @IsOptional()
  payments: UpdateOrderPaymentDto[];
}
