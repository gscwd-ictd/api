import { IsUUID } from 'class-validator';
import { Tag } from '../tags';
import { PartialType } from '@nestjs/swagger';
import { Training } from '../trainings';

//for insert training tag
export class CreateTrainingTagDto {
  @IsUUID('4')
  training: Training;

  @IsUUID('4')
  tag: Tag;
}

//for training details dto
export class TrainingTagDto {
  @IsUUID('4')
  tag: Tag;
}

export class UpdateTrainingTagDto extends PartialType(CreateTrainingTagDto) {}
