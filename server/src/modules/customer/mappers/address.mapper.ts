import { AddressDto } from '../dtos/address.dto';
import { Address } from '@prisma/client';

export class AddressMapper {
  static toDto(address: Address): AddressDto {
    return {
      id: address.id,
      city: address.city,
      neighborhood: address.neighborhood,
      street: address.street,
      number: address.number,
      complement: address.complement,
      reference: address.reference,
    };
  }
}
