import { IsNotEmpty } from 'class-validator';

export class UpdateNameDto {
  @IsNotEmpty()
  newName: string;
}
