import { IsNotEmpty } from 'class-validator';

export class UpdateBalanceDto {
  @IsNotEmpty()
  balance: number;
}
