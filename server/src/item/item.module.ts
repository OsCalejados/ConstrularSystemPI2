import { ItemRepository } from './repositories/item.repository';
import { PrismaService } from 'src/common/services/prisma.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [ItemRepository, PrismaService],
})
export class ItemModule {}
