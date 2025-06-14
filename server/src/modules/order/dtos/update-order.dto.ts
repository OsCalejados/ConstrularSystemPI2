import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderItemDto } from './order-item.dto';

export class UpdateOrderDto {
  @IsNotEmpty()
  customerId: number;

  notes: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  items: OrderItemDto[];
}
