import { CustomerModule } from './customer/customer.module';
// import { PaymentModule } from './payment/payment.module';
// import { OrderModule } from './order/order.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CustomerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
