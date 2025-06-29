import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderType } from '@src/common/enums/order-type.enum';

export class FindOrderOptionsDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeCustomer?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includePayments?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeItems?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeSeller?: boolean = false;

  @IsOptional()
  @IsEnum(OrderType, {
    message: 'type must be one of SALE, QUOTE, INSTALLMENT',
  })
  type?: OrderType;
}
