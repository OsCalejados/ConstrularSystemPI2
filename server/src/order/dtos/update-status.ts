import { OrderStatus } from '../enums/order-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
