import { IsString } from 'class-validator';

export class CourseContent {
  @IsString()
  title: string;
}
