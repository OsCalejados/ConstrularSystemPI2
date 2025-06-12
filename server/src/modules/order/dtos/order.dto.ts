import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { OrderItemDto } from './order-item.dto';
import { CustomerDto } from '@src/modules/customer/dtos/customer.dto';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderType } from 'src/common/enums/order-type.enum';
import { UserDto } from '@src/modules/user/dtos/user.dto';

export class OrderDto {
  id: number;
  notes: string;
  type: OrderType;
  status: OrderStatus;
  total: number;
  discount: number;
  paymentMethod: PaymentMethod;
  paid: boolean;
  installments: number;
  amountPaid: number;
  createdAt: Date;
  customerId: number;
  sellerId: number;
  customer?: CustomerDto;
  seller?: UserDto;
  items?: OrderItemDto[];
}
