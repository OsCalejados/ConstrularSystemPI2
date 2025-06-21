import { IProductRepository } from './interfaces/product.repository.interface';
import { ProductRepository } from './repositories/product.repository';
import { ProductController } from './controllers/product.controller';
import { IProductService } from './interfaces/product.service.interface';
import { ProductService } from './services/product.service';
import { PrismaService } from '@src/common/services/prisma.service';
import { OrderModule } from '../order/order.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [OrderModule],
  controllers: [ProductController],
  providers: [
    {
      provide: IProductService,
      useClass: ProductService,
    },
    {
      provide: IProductRepository,
      useClass: ProductRepository,
    },
    PrismaService,
  ],
})
export class ProductModule {}
