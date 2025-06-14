import { CustomerModule } from './modules/customer/customer.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
// import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, CustomerModule, UserModule, ProductModule, OrderModule],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
