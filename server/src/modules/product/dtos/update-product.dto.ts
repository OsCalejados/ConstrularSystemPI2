import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    description: 'The new name of the product (optional).',
    example: 'Cement CPII 50kg - Updated',
  })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'The new brand of the product (optional).',
    example: 'Votoran Plus',
  })
  @IsOptional()
  @IsNotEmpty()
  brand?: string;

  @ApiPropertyOptional({
    description: 'The new unit of measure for the product (optional).',
    enum: MeasureUnit,
    example: MeasureUnit.KG,
  })
  @IsOptional()
  @IsEnum(MeasureUnit)
  unit?: MeasureUnit;

  @ApiPropertyOptional({
    description: 'The new stock quantity of the product (optional).',
    example: 150,
    type: Number,
  })
  @IsOptional()
  @IsNotEmpty()
  stockQuantity?: number;

  @ApiPropertyOptional({
    description: 'The new cost price of the product (optional).',
    example: 29.0,
    type: Number,
  })
  @IsOptional()
  @IsNotEmpty()
  costPrice?: number;

  @ApiPropertyOptional({
    description: 'The new profit margin for the product (optional).',
    example: 0.22,
    type: Number,
  })
  @IsOptional()
  @IsNotEmpty()
  profitMargin?: number;

  @ApiPropertyOptional({
    description: 'The new calculated profit for the product (optional).',
    example: 6.38,
    type: Number,
  })
  @IsOptional()
  @IsNotEmpty()
  profit?: number;

  @ApiPropertyOptional({
    description: 'The new final sale price of the product (optional).',
    example: 35.38,
    type: Number,
  })
  @IsOptional()
  @IsNotEmpty()
  salePrice?: number;
}
