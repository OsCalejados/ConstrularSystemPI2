import { InMemoryCustomerRepository } from '@src/modules/customer/repositories/in-memory-customer.repository';
import { CustomerService } from '@src/modules/customer/services/customer.service';
import { CustomerFactory } from '@test/factories/customer.factory';

describe('Get Customer by Id', () => {
  let customerRepository: InMemoryCustomerRepository;
  let customerService: CustomerService;

  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository();
    customerService = new CustomerService(customerRepository);
  });

  it('should return the customer with address when includeAddress is true', async () => {
    const dto = CustomerFactory.createCustomer({
      name: 'Alice',
      city: 'City A',
    });

    const created = await customerService.createCustomer(dto);

    const found = await customerService.getCustomerById(created.id, true);

    expect(found).toBeDefined();
    expect(found.id).toBe(created.id);
    expect(found.name).toBe('Alice');
    expect(found.address).toBeDefined();
    expect(found.address?.city).toBe('City A');
  });

  it('should return the customer without address when includeAddress is false', async () => {
    const dto = CustomerFactory.createCustomer({ name: 'Bob', city: 'City B' });
    const created = await customerService.createCustomer(dto);

    const found = await customerService.getCustomerById(created.id, false);

    expect(found).toBeDefined();
    expect(found.id).toBe(created.id);
    expect(found.name).toBe('Bob');
    expect(found.address).toBeUndefined();
  });

  it('should throw if customer does not exist', async () => {
    await expect(customerService.getCustomerById(999, true)).rejects.toThrow();
  });
});
