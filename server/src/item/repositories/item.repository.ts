import { PrismaService } from 'src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemRepository {
  constructor(private prisma: PrismaService) {}

  async deleteMany(orderId: number) {
    return await this.prisma.item.deleteMany({
      where: {
        orderId,
      },
    });
  }
}
