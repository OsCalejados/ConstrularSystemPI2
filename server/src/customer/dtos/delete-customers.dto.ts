import { IsNotEmpty } from 'class-validator';

export class DeleteCustomersDto {
  @IsNotEmpty()
  customerIds: number[];
}
