import { IsString } from 'class-validator';

export class SubjectMatterExperts {
  @IsString()
  subjectMatter: string;
}
