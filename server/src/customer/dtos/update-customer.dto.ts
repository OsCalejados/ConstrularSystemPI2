import { IsEmail, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  phone: string;

  district: string;

  street: string;

  number: string;

  complement: string;

  landmark: string;
}
