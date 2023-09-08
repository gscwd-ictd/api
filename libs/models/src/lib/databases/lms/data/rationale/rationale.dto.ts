import { IsString } from 'class-validator';

export class RationaleDto {
  @IsString()
  description: string;
}
