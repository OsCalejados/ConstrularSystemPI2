import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderItemDto } from './order-item.dto';
import { OrderType } from 'src/common/enums/order-type.enum';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  customerId: number;

  notes: string;

  @IsEnum(OrderType)
  type: OrderType;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  total: number;

  discount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  paid: boolean;

  installments: number;

  amountPaid: number;

  @IsNotEmpty()
  items: OrderItemDto[];
}
