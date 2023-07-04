import { IsUUID } from 'class-validator';
import { TrainingIndividualDetails } from '../training-individual-details';
import { Tag } from '../tags';
import { PartialType } from '@nestjs/swagger';

export class CreateTrainingIndividualTagDto {
  @IsUUID('4')
  trainingIndividualDetails: TrainingIndividualDetails;

  @IsUUID('4')
  tag: Tag;
}

export class UpdateTrainingIndividualTagDto extends PartialType(CreateTrainingIndividualTagDto) {}
