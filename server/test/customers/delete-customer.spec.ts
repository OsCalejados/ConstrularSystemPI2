import { InMemoryCustomerRepository } from '@src/modules/customer/repositories/in-memory-customer.repository';
import { CustomerService } from '@src/modules/customer/services/customer.service';
import { CustomerFactory } from '@test/factories/customer.factory';

describe('Delete Customer', () => {
  let customerRepository: InMemoryCustomerRepository;
  let customerService: CustomerService;

  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository();
    customerService = new CustomerService(customerRepository);
  });

  it('should delete an existing customer', async () => {
    const created = await customerService.createCustomer(
      CustomerFactory.createCustomer(),
    );

    const found = await customerService.getCustomerById(created.id, true);
    expect(found).toBeDefined();

    await customerService.deleteCustomer(created.id);

    await expect(
      customerService.getCustomerById(created.id, true),
    ).rejects.toThrow();
  });

  it('should throw an error if trying to delete a non-existent customer', async () => {
    await expect(customerService.deleteCustomer(999)).rejects.toThrow();
  });

  it('should allow deleting a customer without address', async () => {
    const created = await customerService.createCustomer(
      CustomerFactory.createCustomer({
        city: undefined,
        neighborhood: undefined,
        street: undefined,
        number: undefined,
        complement: undefined,
        reference: undefined,
      }),
    );

    await customerService.deleteCustomer(created.id);

    await expect(
      customerService.getCustomerById(created.id, true),
    ).rejects.toThrow();
  });
});
