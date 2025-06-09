import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    description: 'The unique identifier of the product.',
    example: 1,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'The name of the product.',
    example: 'Cement CPII 50kg',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The brand of the product.',
    example: 'Votoran',
  })
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    description: 'The unit of measure for the product.',
    enum: MeasureUnit,
    example: MeasureUnit.UN,
  })
  @IsNotEmpty()
  @IsEnum(MeasureUnit)
  unit: string;

  @ApiProperty({
    description: 'The current stock quantity of the product.',
    example: 100,
    type: Number,
  })
  @IsNotEmpty()
  stockQuantity: number;

  @ApiProperty({
    description: 'The cost price of the product.',
    example: 28.5,
    type: Number,
  })
  @IsNotEmpty()
  costPrice: number;

  @ApiProperty({
    description: 'The profit margin for the product (e.g., 0.2 for 20%).',
    example: 0.2,
    type: Number,
  })
  @IsNotEmpty()
  profitMargin: number;

  @ApiProperty({
    description:
      'The calculated profit for the product (costPrice * profitMargin).',
    example: 5.7,
    type: Number,
  })
  @IsNotEmpty()
  profit: number;

  @ApiProperty({
    description: 'The final sale price of the product (costPrice + profit).',
    example: 34.2,
    type: Number,
  })
  @IsNotEmpty()
  salePrice: number;

  @ApiProperty({
    description: 'The date and time when the product was created.',
    example: '2025-06-09T10:00:00.000Z',
    type: Date,
  })
  @IsNotEmpty()
  createdAt: Date;
}
