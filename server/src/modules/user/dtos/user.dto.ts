import { Role } from 'src/modules/user/enums/role';

export class UserDto {
  id: number;
  name: string;
  username: string;
  role: Role;
}
