import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserRepository],
  exports: [],
})
export class UserModule {}
