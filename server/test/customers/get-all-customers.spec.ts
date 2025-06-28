import { InMemoryCustomerRepository } from '@src/modules/customer/repositories/in-memory-customer.repository';
import { CustomerService } from '@src/modules/customer/services/customer.service';
import { CustomerFactory } from '@test/factories/customer.factory';

describe('Get All Customers', () => {
  let customerRepository: InMemoryCustomerRepository;
  let customerService: CustomerService;

  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository();
    customerService = new CustomerService(customerRepository);
  });

  it('should return an empty array when no customers are registered', async () => {
    const customers = await customerService.getAllCustomers();

    expect(Array.isArray(customers)).toBe(true);
    expect(customers.length).toBe(0);
  });

  it('should return all registered customers', async () => {
    await customerService.createCustomer(
      CustomerFactory.createCustomer({ name: 'John' }),
    );
    await customerService.createCustomer(
      CustomerFactory.createCustomer({ name: 'Alice' }),
    );
    await customerService.createCustomer(
      CustomerFactory.createCustomer({ name: 'Bob' }),
    );

    const customers = await customerService.getAllCustomers();

    expect(customers.length).toBe(3);
    const names = customers.map((c) => c.name);
    expect(names).toContain('John');
    expect(names).toContain('Alice');
    expect(names).toContain('Bob');
  });
});
