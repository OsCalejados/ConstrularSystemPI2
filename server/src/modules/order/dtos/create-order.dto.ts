import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { OrderType } from '@src/common/enums/order-type.enum';
import { CreateOrderItemDto } from './create-order-item.dto';
import { CreateOrderPaymentDto } from './create-order-payment.dto';
import { OrderStatus } from '@src/common/enums/order-status.enum';

export class CreateOrderDto {
  total: number;

  subtotal: number;

  discount: number;

  notes: string;

  customerId: number;

  status: OrderStatus;

  paid: boolean;

  @IsEnum(OrderType)
  type: OrderType;

  @IsNotEmpty()
  items: CreateOrderItemDto[];

  @IsOptional()
  payments: CreateOrderPaymentDto[];

  @IsOptional()
  useBalance: boolean;
}
