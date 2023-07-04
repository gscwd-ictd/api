import { IsUUID } from 'class-validator';
import { TrainingDetails } from '../training-details';
import { Tag } from '../tags';
import { PartialType } from '@nestjs/swagger';

export class CreateTrainingTagDto {
  @IsUUID('4')
  trainingDetails: TrainingDetails;

  @IsUUID('4')
  tag: Tag;
}

export class UpdateTrainingTagDto extends PartialType(CreateTrainingTagDto) {}
