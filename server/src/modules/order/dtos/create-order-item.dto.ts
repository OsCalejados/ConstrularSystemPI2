import { IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  unitPrice: number;

  @IsNotEmpty()
  total: number;
}
