import { IsEnum, IsNotEmpty } from 'class-validator';
import { MeasureUnit } from '../../../common/enums/measure-unit.enum';

export class ItemDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(MeasureUnit)
  unit: MeasureUnit;

  @IsNotEmpty()
  quantity: number;
}
