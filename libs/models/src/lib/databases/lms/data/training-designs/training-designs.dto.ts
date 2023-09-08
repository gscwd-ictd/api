import { Type } from 'class-transformer';
import { IsArray, IsString, Length, ValidateNested } from 'class-validator';
import { RationaleDto } from '../rationale';
import { CourseDescriptionDto } from '../course-descriptions';
import { CourseObjectiveDto } from '../course-objectives';
import { TargetParticipants } from '../target-participants';
import { MethodologyDto } from '../methodologies';
import { ExpectedOutputDto } from '../expected-outputs/expected-output.dto';
import { RecognitionDto } from '../recognitions';

export class CreateTrainingDesignDto {
  @IsString({ message: 'training design course title must be a string' })
  @Length(1, 100, { message: 'training design course title must be between 1 to 100 characters' })
  courseTitle: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => RationaleDto)
  rationale: RationaleDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseDescriptionDto)
  courseDescription: CourseDescriptionDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CourseObjectiveDto)
  courseObjective: CourseObjectiveDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TargetParticipants)
  targetParticipants: TargetParticipants[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => MethodologyDto)
  methodologies: MethodologyDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ExpectedOutputDto)
  expectedOutput: ExpectedOutputDto[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => RecognitionDto)
  recognition: RecognitionDto[];
}
