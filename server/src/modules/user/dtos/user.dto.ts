import { Role } from 'src/common/enums/role';

export class UserDto {
  id: number;
  name: string;
  username: string;
  role: Role;
}
