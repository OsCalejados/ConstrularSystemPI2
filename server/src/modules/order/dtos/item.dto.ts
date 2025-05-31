import { IsEnum, IsNotEmpty } from 'class-validator';
import { MesureUnit } from '../enums/mesure-unit.enum';

export class ItemDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(MesureUnit)
  unit: MesureUnit;

  @IsNotEmpty()
  quantity: number;
}
