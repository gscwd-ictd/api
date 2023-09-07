import { IsString } from 'class-validator';

export class CourseObjectiveDto {
  @IsString()
  objective: string;
}
