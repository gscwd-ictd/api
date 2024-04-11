import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsNotEmpty, IsString, IsUUID, Length, ValidateNested } from 'class-validator';
import { ParticipantsDto, UpdateBenchmarkParticipantsDto } from '../benchmark-participants';

export class BenchmarkDto {
  @IsNotEmpty()
  @IsString({ message: 'benchmark title must be a string' })
  @Length(1, 300, { message: 'benchmark title must be between 1 to 300 characters' })
  title: string;

  @IsNotEmpty()
  @IsString({ message: 'benchmark partner must be a string' })
  @Length(1, 250, { message: 'benchmark partner must be between 1 to 250 characters' })
  partner: string;

  @IsNotEmpty()
  @IsDateString()
  dateStarted: Date;

  @IsNotEmpty()
  @IsDateString()
  dateEnd: Date;

  @IsNotEmpty()
  @IsString({ message: 'benchmark location must be a string' })
  @Length(1, 500, { message: 'benchmark location must be between 1 to 500 characters' })
  location: string;
}

export class ParticipantRequirementsDto {
  @IsNotEmpty()
  @IsUUID('all')
  employeeId: string;

  @IsNotEmpty()
  @IsBoolean()
  learningApplicationPlan: boolean;
}

export class CreateBenchmarkDto extends PartialType(BenchmarkDto) {
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantsDto)
  participants: Array<ParticipantsDto>;
}

export class UpdateBenchmarkDto extends PartialType(BenchmarkDto) {
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantRequirementsDto)
  participants: Array<ParticipantRequirementsDto>;
}
