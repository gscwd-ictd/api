import { IsString } from 'class-validator';

export class CourseContentDto {
  @IsString()
  title: string;
}
