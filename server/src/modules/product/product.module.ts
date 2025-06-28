import { ProductRepository } from './repositories/product.repository';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { forwardRef, Module } from '@nestjs/common'; // 'forwardRef' já está importado, mas é bom verificar
import { PrismaService } from '@src/common/services/prisma.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [forwardRef(() => OrderModule)], // Usar forwardRef para resolver a dependência circular
  controllers: [ProductController],
  providers: [
    {
      provide: 'IProductService',
      useClass: ProductService,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    PrismaService,
  ],
  exports: ['IProductService', 'IProductRepository'],
})
export class ProductModule {}
