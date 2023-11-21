import { IsNotEmpty, IsUUID } from 'class-validator';
import { Tag } from '../tags';
import { PartialType } from '@nestjs/swagger';
import { TrainingDetails } from '../training-details';

export class TrainingTagDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: Tag;
}

export class CreateTrainingTagDto extends TrainingTagDto {
  @IsUUID('4')
  trainingDetails: TrainingDetails;
}

export class UpdateTrainingTagDto extends PartialType(CreateTrainingTagDto) {}
