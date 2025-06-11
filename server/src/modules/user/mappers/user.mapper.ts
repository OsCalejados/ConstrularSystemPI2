import { UserDto } from '../dtos/user.dto';
import { User } from '@prisma/client';
import { Role } from 'src/common/enums/role';

export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role as Role,
    };
  }
}
