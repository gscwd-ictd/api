import { IsString } from 'class-validator';

export class RecognitionDto {
  @IsString()
  description: string;
}
