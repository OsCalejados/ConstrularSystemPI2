import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
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
