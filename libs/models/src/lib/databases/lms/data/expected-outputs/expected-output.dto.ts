import { IsString } from 'class-validator';

export class ExpectedOutputDto {
  @IsString()
  output: string;
}
