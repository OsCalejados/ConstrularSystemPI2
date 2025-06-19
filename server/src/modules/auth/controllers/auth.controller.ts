import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUserId } from '@src/common/decorators/current-user-id.decorator';
import { AuthService } from '../services/auth.service';
import { isPublic } from '@src/common/decorators/is-public.decorator';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @isPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUserId() userId: number) {
    return await this.authService.login(userId);
  }
}
