import { IsNotEmpty, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { TrainingDetailsDto } from '../training-details';
import { TagDto } from '../tags';

export class TrainingTagDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: TagDto;
}

export class CreateTrainingTagDto extends TrainingTagDto {
  @IsNotEmpty()
  @IsUUID('4')
  trainingDetails: TrainingDetailsDto;
}

export class UpdateTrainingTagDto extends PartialType(CreateTrainingTagDto) {}
