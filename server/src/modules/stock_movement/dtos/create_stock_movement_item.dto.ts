import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockMovementItem {
  @ApiProperty({
    description: 'The quantity of the product moved.',
    example: 10,
    type: Number,
  })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'The id of product associated with the stock movement item.',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  productId: number;
}
