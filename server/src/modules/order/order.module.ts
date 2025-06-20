import { PrismaOrderRepository } from './repositories/prisma-order.repository';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { OrderController } from './controllers/order.controller';
import { IOrderService } from './interfaces/order.service.interface';
import { PrismaService } from 'src/common/services/prisma.service';
import { OrderService } from './services/order.service';
import { Module } from '@nestjs/common';
import { InstallmentOrderStrategy } from './strategies/installment.strategy';
import { QuoteOrderStrategy } from './strategies/quote.strategy';
import { SaleOrderStrategy } from './strategies/sale.strategy';
import { CustomerModule } from '../customer/customer.module';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { IPaymentRepository } from './interfaces/payment.repository.interface';
import { PrismaPaymentRepository } from './repositories/payment.repository';

@Module({
  imports: [CustomerModule],
  controllers: [OrderController, PaymentController],
  providers: [
    OrderService,
    PrismaService,
    PaymentService,
    SaleOrderStrategy,
    QuoteOrderStrategy,
    InstallmentOrderStrategy,
    {
      provide: IOrderService,
      useExisting: OrderService,
    },
    {
      provide: IOrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: IPaymentRepository,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: 'ORDER_STRATEGIES',
      useFactory: (
        sale: SaleOrderStrategy,
        quote: QuoteOrderStrategy,
        installment: InstallmentOrderStrategy,
      ) => [sale, quote, installment],
      inject: [SaleOrderStrategy, QuoteOrderStrategy, InstallmentOrderStrategy],
    },
  ],
  exports: [OrderService, IOrderService, IOrderRepository],
})
export class OrderModule {}
