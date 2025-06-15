import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentMethod } from '@src/common/enums/payment-method.enum';
import { OrderItemDto } from './order-item.dto';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderType } from '@src/common/enums/order-type.enum';

export class UpdateOrderDto {
  @IsNotEmpty()
  customerId: number;

  notes: string;

  @IsEnum(OrderType)
  type: OrderType;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  total: number;

  netTotal: number;

  discount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  paid: boolean;

  installments: number;

  amountPaid: number;

  @IsNotEmpty()
  items: OrderItemDto[];
}
