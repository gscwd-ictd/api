import { IsUUID } from 'class-validator';
import { Training } from '../trainings';
import { Tag } from '../tags';
import { PartialType } from '@nestjs/swagger';

export class CreateTrainingTagDto {
  @IsUUID('4')
  training: Training;

  @IsUUID('4')
  tag: Tag;
}

export class UpdateTrainingTagDto extends PartialType(CreateTrainingTagDto) {}
