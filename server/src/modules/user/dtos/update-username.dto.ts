import { IsNotEmpty } from 'class-validator';

export class UpdateUsernameDto {
  @IsNotEmpty()
  newUsername: string;
}
