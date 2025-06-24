import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '@src/common/enums/movement_type.enum';
import { CreateStockMovementItem } from './create_stock_movement_item.dto';

export class CreateStockMovementDTO {
  @ApiProperty({
    description: 'The type of movement wich can be IN or OUT.',
    enum: MovementType,
    example: MovementType.IN,
  })
  @IsNotEmpty()
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({
    description: 'The description of the stock movement.',
    example: 'Stock movement for product X, quantity Y, type Z',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The items associated with the stock movement.',
    type: () => CreateStockMovementItem,
  })
  @IsNotEmpty()
  items: CreateStockMovementItem[];
}
