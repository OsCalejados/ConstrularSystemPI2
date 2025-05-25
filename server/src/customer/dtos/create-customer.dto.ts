import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  phone: string;

  city: string;

  neighborhood: string;

  street: string;

  number: string;

  complement: string;

  reference: string;
}
