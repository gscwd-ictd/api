import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { ParticipantsDto } from '../benchmark-participants';

export class BenchmarkDto {
  @IsNotEmpty()
  @IsString({ message: 'benchmark title must be a string' })
  @Length(1, 300, { message: 'benchmark title must be between 1 to 300 characters' })
  title: string;

  @IsNotEmpty()
  @IsString({ message: 'benchmark description must be a string' })
  @Length(1, 500, { message: 'benchmark description must be between 1 to 500 characters' })
  description: string;

  @IsNotEmpty()
  @IsString({ message: 'benchmark partner must be a string' })
  @Length(1, 250, { message: 'benchmark partner must be between 1 to 250 characters' })
  partner: string;

  @IsNotEmpty()
  @IsDateString()
  dateFrom: Date;

  @IsNotEmpty()
  @IsDateString()
  dateTo: Date;

  @IsNotEmpty()
  @IsString({ message: 'benchmark location must be a string' })
  @Length(1, 500, { message: 'benchmark location must be between 1 to 500 characters' })
  location: string;
}

export class CreateBenchmarkDto extends PartialType(BenchmarkDto) {
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantsDto)
  participants: Array<ParticipantsDto>;
}

export class UpdateBenchmarkDto extends PartialType(CreateBenchmarkDto) {}
