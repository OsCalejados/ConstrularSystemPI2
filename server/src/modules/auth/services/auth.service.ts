import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { PayloadDto } from '../dtos/payload.dto';
import { UserMapper } from 'src/modules/user/mappers/user.mapper';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(userId: number) {
    const user = await this.userRepository.findById(userId);

    const payload = {
      sub: user.id,
      username: user.username,
    } as PayloadDto;

    const token = this.jwtService.sign(payload);

    const userDto = UserMapper.toDto(user);

    return {
      user: userDto,
      access_token: token,
    };
  }

  async validate(loginDto: LoginDto): Promise<number> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findByUsername(username);

    if (user && password === user.password) {
      return user.id;
    }
  }
}
