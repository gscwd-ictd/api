import { IsString } from 'class-validator';

export class CreateImsLogDto {
  @IsString()
  host: string;

  @IsString()
  url: string;

  @IsString()
  method: string;

  @IsString()
  headers: string;
}
