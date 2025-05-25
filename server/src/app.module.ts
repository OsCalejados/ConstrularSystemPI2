import { CustomerModule } from './customer/customer.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { ItemModule } from './item/item.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomerModule, OrderModule, ItemModule, PaymentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
