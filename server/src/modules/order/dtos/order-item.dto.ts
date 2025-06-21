import { ProductDto } from '@src/modules/product/dtos/product.dto';
import { IsNotEmpty } from 'class-validator';

export class OrderItemDto {
  id: number;

  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  unitPrice: number;

  @IsNotEmpty()
  total: number;

  product: ProductDto;
}
