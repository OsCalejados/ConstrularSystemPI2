import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  city: string;

  @IsOptional()
  neighborhood: string;

  @IsOptional()
  street: string;

  @IsOptional()
  number: string;

  @IsOptional()
  complement: string;

  @IsOptional()
  reference: string;
}
