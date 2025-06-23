import { InstallmentOrderStrategy } from './strategies/installment.strategy';
import { PrismaPaymentRepository } from './repositories/prisma-payment.repository';
import { PrismaOrderRepository } from './repositories/prisma-order.repository';
import { IPaymentRepository } from './interfaces/payment.repository.interface';
import { QuoteOrderStrategy } from './strategies/quote.strategy';
import { SaleOrderStrategy } from './strategies/sale.strategy';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { OrderController } from './controllers/order.controller';
import { PaymentService } from './services/payment.service';
import { CustomerModule } from '../customer/customer.module';
import { IOrderService } from './interfaces/order.service.interface';
import { PrismaService } from '@src/common/services/prisma.service';
import { OrderService } from './services/order.service';
import { Module } from '@nestjs/common';
import { ProductRepository } from '../product/repositories/product.repository';
import { IProductRepository } from '../product/interfaces/product.repository.interface';

@Module({
  imports: [CustomerModule],
  controllers: [OrderController],
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
      provide: IProductRepository,
      useClass: ProductRepository,
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
