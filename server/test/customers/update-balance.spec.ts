import { InMemoryCustomerRepository } from '@src/modules/customer/repositories/in-memory-customer.repository';
import { CustomerService } from '@src/modules/customer/services/customer.service';
import { CustomerFactory } from '@test/factories/customer.factory';

describe('Update Customer Balance', () => {
  let customerRepository: InMemoryCustomerRepository;
  let customerService: CustomerService;

  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository();
    customerService = new CustomerService(customerRepository);
  });

  it('should update the balance of an existing customer from 0 to 150.75', async () => {
    const created = await customerService.createCustomer(
      CustomerFactory.createCustomer(),
    );

    expect(created.balance).toBe(0);

    const updateBalanceDto = CustomerFactory.updateBalance(150.75);

    const updated = await customerService.updateBalance(
      created.id,
      updateBalanceDto,
    );

    expect(updated).toBeDefined();
    expect(updated.id).toBe(created.id);
    expect(updated.balance).toBe(150.75);
  });

  it('should allow balance to be zero (from non-zero)', async () => {
    const created = await customerService.createCustomer(
      CustomerFactory.createCustomer(),
    );

    await customerService.updateBalance(
      created.id,
      CustomerFactory.updateBalance(100),
    );

    const updated = await customerService.updateBalance(
      created.id,
      CustomerFactory.updateBalance(0),
    );

    expect(updated.balance).toBe(0);
  });

  it('should update balance with a negative value', async () => {
    const created = await customerService.createCustomer(
      CustomerFactory.createCustomer(),
    );

    const updated = await customerService.updateBalance(
      created.id,
      CustomerFactory.updateBalance(-50),
    );

    expect(updated.balance).toBe(-50);
  });

  it('should throw an error if the customer does not exist', async () => {
    const updateBalanceDto = CustomerFactory.updateBalance(100);

    await expect(
      customerService.updateBalance(999, updateBalanceDto),
    ).rejects.toThrow();
  });
});
