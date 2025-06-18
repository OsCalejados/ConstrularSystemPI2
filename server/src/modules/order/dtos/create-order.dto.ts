import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderItemDto } from './order-item.dto';
import { OrderType } from '@src/common/enums/order-type.enum';
import { PaymentMethod } from '@src/common/enums/payment-method.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  customerId: number;

  @IsEnum(OrderType)
  type: OrderType;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  total: number;

  discount: number;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  paid: boolean;

  installments: number;

  amount_paid: number;

  @IsNotEmpty()
  items: OrderItemDto[];
}
