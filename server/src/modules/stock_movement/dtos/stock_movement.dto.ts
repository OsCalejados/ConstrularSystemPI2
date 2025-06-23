import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '@src/common/enums/movement_type.enum';
import { StockMovementItemDTO } from './stock_movement_item.dto';

export class StockMovementDTO {
  @ApiProperty({
    description: 'The unique identifier of the stock movement.',
    example: 1,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'The type of movement wich can be IN or OUT.',
    enum: MovementType,
    example: MovementType.IN,
  })
  @IsNotEmpty()
  @IsEnum(MovementType)
  type: string;

  @ApiProperty({
    description: 'The description of the stock movement.',
    example: 'Stock movement for product X, quantity Y, type Z',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The date and time when the product was created.',
    example: '2025-06-09T10:00:00.000Z',
    type: Date,
  })
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'The product associated with the stock movement.',
    type: () => StockMovementItemDTO,
  })
  @IsNotEmpty()
  items: StockMovementItemDTO[];
}
