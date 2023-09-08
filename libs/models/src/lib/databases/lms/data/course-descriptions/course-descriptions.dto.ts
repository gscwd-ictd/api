import { IsString } from 'class-validator';

export class CourseDescriptionDto {
  @IsString()
  description: string;
}
