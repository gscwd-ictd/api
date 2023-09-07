import { IsString } from 'class-validator';

export class MethodologyDto {
  @IsString()
  method: string;
}
