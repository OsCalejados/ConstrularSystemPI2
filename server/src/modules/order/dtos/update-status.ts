import { OrderStatus } from '../../../common/enums/order-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
