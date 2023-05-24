import { IsString } from 'class-validator';

export class LspSubjectDto {
  @IsString()
  subject: string;
}
