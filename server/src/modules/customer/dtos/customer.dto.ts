import { AddressDto } from './address.dto';

export class CustomerDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
  address?: AddressDto;
}
