import { IsEmail, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
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
