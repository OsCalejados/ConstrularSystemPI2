import { InMemoryCustomerRepository } from '@src/modules/customer/repositories/in-memory-customer.repository';
import { CustomerService } from '@src/modules/customer/services/customer.service';
import { CustomerFactory } from '@test/factories/customer.factory';

describe('Update Customer', () => {
  let customerRepository: InMemoryCustomerRepository;
  let customerService: CustomerService;

  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository();
    customerService = new CustomerService(customerRepository);
  });

  it('should update all fields of an existing customer', async () => {
    const created = await customerService.createCustomer(
      CustomerFactory.createCustomer({ name: 'Original Name' }),
    );

    const updateDto = CustomerFactory.updateCustomer({
      name: 'Updated Name',
      email: 'new@example.com',
      phone: '999999999',
      city: 'New City',
    });

    const updated = await customerService.updateCustomer(created.id, updateDto);

    expect(updated).toBeDefined();
    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe('Updated Name');
    expect(updated.email).toBe('new@example.com');
    expect(updated.phone).toBe('999999999');
    expect(updated.address?.city).toBe('New City');
  });

  it('should allow partial update (e.g., only name)', async () => {
    const created = await customerService.createCustomer(
      CustomerFactory.createCustomer({
        name: 'John',
        email: 'john@example.com',
      }),
    );

    const updateDto = CustomerFactory.updateCustomer({
      name: 'Johnny',
      email: undefined,
    });

    const updated = await customerService.updateCustomer(created.id, updateDto);

    expect(updated.name).toBe('Johnny');
    expect(updated.email).toBe('john@example.com'); // should remain unchanged
  });

  it('should throw an error if the customer does not exist', async () => {
    const updateDto = CustomerFactory.updateCustomer();

    await expect(
      customerService.updateCustomer(999, updateDto),
    ).rejects.toThrow();
  });
});
