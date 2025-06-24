import { Module } from '@nestjs/common';
import { PrismaService } from '@src/common/services/prisma.service';
import { OrderModule } from '../order/order.module';
import { StockMovementController } from './controllers/stock_movement.controller';
import { StockMovementService } from './services/stock_movement.service';
import { StockMovementRepository } from './repositories/stock_movement.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [OrderModule, ProductModule],
  controllers: [StockMovementController],
  providers: [
    {
      provide: 'IStockMovementService',
      useClass: StockMovementService,
    },
    {
      provide: 'IStockMovementRepository',
      useClass: StockMovementRepository,
    },
    PrismaService,
  ],
})
export class StockMovementModule {}
