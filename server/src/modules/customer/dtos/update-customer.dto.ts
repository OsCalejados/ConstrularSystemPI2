import { IsEmail, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
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
