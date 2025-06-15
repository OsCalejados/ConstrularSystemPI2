import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

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
  includeProducts?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeSeller?: boolean = false;
}
