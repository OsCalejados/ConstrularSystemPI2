import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '@src/modules/product/dtos/product.dto';

export class StockMovementItemDTO {
  @ApiProperty({
    description: 'The unique identifier of the item im stock movement.',
    example: 1,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'The quantity of the product moved.',
    example: 10,
    type: Number,
  })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'The product associated with the stock movement item.',
    type: () => ProductDto,
  })
  @IsNotEmpty()
  product: ProductDto;

  @ApiProperty({
    description: 'The id of stock movement.',
    example: 1,
  })
  @IsNotEmpty()
  stockMovementId: number;
}
