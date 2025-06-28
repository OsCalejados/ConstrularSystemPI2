import { IsNotEmpty } from 'class-validator';

export class UpdateNotesDto {
  @IsNotEmpty()
  notes: string;
}
