import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';
import { ItemDto } from './item.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  customerId: number;

  notes: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  items: ItemDto[];
}
