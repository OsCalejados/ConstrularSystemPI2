import { InMemoryCustomerRepository } from '@src/modules/customer/repositories/in-memory-customer.repository';
import { CustomerService } from '@src/modules/customer/services/customer.service';
import { CustomerFactory } from '@test/factories/customer.factory';

describe('Create Customer', () => {
  let customerRepository: InMemoryCustomerRepository;
  let customerService: CustomerService;

  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository();
    customerService = new CustomerService(customerRepository);
  });

  it('should create a customer with required fields only', async () => {
    const dto = CustomerFactory.createCustomer({
      email: undefined,
      phone: undefined,
      city: undefined,
      neighborhood: undefined,
      street: undefined,
      number: undefined,
      complement: undefined,
      reference: undefined,
    });

    const customer = await customerService.createCustomer(dto);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe(dto.name);
    expect(customer.email).toBeUndefined();
    expect(customer.address?.city).toBeUndefined();
  });

  it('should create a customer with all fields filled', async () => {
    const dto = CustomerFactory.createCustomer();

    const customer = await customerService.createCustomer(dto);

    expect(customer.name).toBe(dto.name);
    expect(customer.email).toBe(dto.email);
    expect(customer.address?.city).toBe(dto.city);
    expect(customer.address?.complement).toBe(dto.complement);
  });

  it('should create a customer even if optional address fields are null', async () => {
    const dto = CustomerFactory.createCustomer({
      city: null,
      neighborhood: null,
      street: null,
      number: null,
      complement: null,
      reference: null,
    });

    const customer = await customerService.createCustomer(dto);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe(dto.name);
    expect(customer.address?.city).toBeNull();
    expect(customer.address?.street).toBeNull();
  });

  it('should create a customer even if optional contact fields are null', async () => {
    const dto = CustomerFactory.createCustomer({
      email: null,
      phone: null,
    });

    const customer = await customerService.createCustomer(dto);

    expect(customer.email).toBeNull();
    expect(customer.phone).toBeNull();
  });

  it('should throw if name is missing', async () => {
    const dto = CustomerFactory.createCustomer({ name: undefined });

    await expect(customerService.createCustomer(dto)).rejects.toThrow();
  });

  it('should throw if name is null', async () => {
    const dto = CustomerFactory.createCustomer({ name: null });

    await expect(customerService.createCustomer(dto)).rejects.toThrow();
  });
});
