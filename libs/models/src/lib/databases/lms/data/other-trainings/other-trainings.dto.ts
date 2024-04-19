import { OtherTrainingCategory } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsDateString, IsEnum, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { OtherTrainingParticipantDto } from '../other-training-participants';
import { Type } from 'class-transformer';

export class OtherTrainingDto {
  @IsNotEmpty()
  @IsString({ message: 'other training title must be a string' })
  @Length(1, 300, { message: 'other training title must be between 1 to 300 characters' })
  title: string;

  @IsNotEmpty()
  @IsDateString()
  dateFrom: Date;

  @IsNotEmpty()
  @IsDateString()
  dateTo: Date;

  @IsNotEmpty()
  @IsString({ message: 'other training location must be a string' })
  @Length(1, 500, { message: 'other training location must be between 1 to 500 characters' })
  location: string;

  @IsNotEmpty()
  @IsEnum(OtherTrainingCategory)
  category: OtherTrainingCategory;
}

export class CreateOtherTrainingDto extends PartialType(OtherTrainingDto) {
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherTrainingParticipantDto)
  participants: Array<OtherTrainingParticipantDto>;
}
