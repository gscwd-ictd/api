import { IsString } from 'class-validator';

export class PostTrainingRequirementsDto {
  @IsString()
  document: string;
}
