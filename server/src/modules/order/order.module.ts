import { forwardRef, Module } from '@nestjs/common'; // 'forwardRef' já está importado, mas é bom verificar
import { InstallmentOrderStrategy } from './strategies/installment.strategy';
import { PrismaPaymentRepository } from './repositories/prisma-payment.repository';
import { PrismaOrderRepository } from './repositories/prisma-order.repository';
import { QuoteOrderStrategy } from './strategies/quote.strategy';
import { SaleOrderStrategy } from './strategies/sale.strategy';
import { OrderController } from './controllers/order.controller';
import { PaymentService } from './services/payment.service';
import { PrismaService } from '@src/common/services/prisma.service';
import { OrderService } from './services/order.service';
import { ProductRepository } from '../product/repositories/product.repository';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [CustomerModule, forwardRef(() => ProductModule)], // Usar forwardRef para resolver a dependência circular
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    PaymentService,
    SaleOrderStrategy,
    QuoteOrderStrategy,
    InstallmentOrderStrategy,
    {
      provide: 'IOrderService',
      useExisting: OrderService,
    },
    {
      provide: 'IOrderRepository',
      useClass: PrismaOrderRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'IPaymentRepository',
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
  exports: [OrderService, 'IOrderService', 'IOrderRepository'],
})
export class OrderModule {}
