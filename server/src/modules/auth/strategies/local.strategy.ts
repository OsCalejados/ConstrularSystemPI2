import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<number> {
    const userId = await this.authService.validate({
      username,
      password,
    } as LoginDto);

    return userId;
  }
}
