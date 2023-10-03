import { IsUUID } from 'class-validator';
import { Tag } from '../tags';
import { PartialType } from '@nestjs/swagger';
import { TrainingDetails } from '../training-details';

//for insert training tag
export class CreateTrainingTagDto {
  @IsUUID('4')
  trainingDetails: TrainingDetails;

  @IsUUID('4')
  tag: Tag;
}

export class UpdateTrainingTagDto extends PartialType(CreateTrainingTagDto) {}
