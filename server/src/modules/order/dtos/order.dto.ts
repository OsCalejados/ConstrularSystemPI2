import { OrderItemDto } from './order-item.dto';
import { CustomerDto } from '@src/modules/customer/dtos/customer.dto';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderType } from 'src/common/enums/order-type.enum';
import { UserDto } from '@src/modules/user/dtos/user.dto';
import { OrderPaymentDto } from './order-payment.dto';

export class OrderDto {
  id: number;
  notes: string;
  type: OrderType;
  status: OrderStatus;
  total: number;
  discount: number;
  netTotal: number;
  paid: boolean;
  createdAt: Date;
  customerId: number;
  sellerId: number;
  payments?: OrderPaymentDto;
  customer?: CustomerDto;
  seller?: UserDto;
  items?: OrderItemDto[];
}
