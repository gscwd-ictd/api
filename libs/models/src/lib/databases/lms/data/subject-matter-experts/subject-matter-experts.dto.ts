import { IsString } from 'class-validator';

export class LspSubjectDto {
  @IsString()
  subjectMatter: string;
}
