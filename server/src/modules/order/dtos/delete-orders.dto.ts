import { IsNotEmpty } from 'class-validator';

export class DeleteOrdersDto {
  @IsNotEmpty()
  orderIds: number[];
}
