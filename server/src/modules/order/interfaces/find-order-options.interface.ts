import { OrderType } from '@src/common/enums/order-type.enum';

export interface FindOrderOptions {
  includePayments?: boolean;
  includeCustomer?: boolean;
  includeSeller?: boolean;
  includeItems?: boolean;
  type?: OrderType;
}
