import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUserId } from '@src/common/decorators/current-user-id.decorator';
import { AuthService } from '../services/auth.service';
import { isPublic } from '@src/common/decorators/is-public.decorator';
import { Response } from 'express';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @isPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, access_token } = await this.authService.login(userId);

    res.cookie('session', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
    });

    return { user };
  }

  @isPublic()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    console.log('test');
    res.clearCookie('session', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    return { message: 'Logout successful' };
  }
}
