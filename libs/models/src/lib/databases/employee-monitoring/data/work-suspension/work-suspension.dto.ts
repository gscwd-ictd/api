import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, ValidateIf } from 'class-validator';
import { WorkSuspensionType } from './work-suspension.entity';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export class CreateWorkSuspensionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Date)
  @IsDate()
  suspensionDate: Date;

  /** LEGACY cannot be created through the API */
  @IsEnum(WorkSuspensionType)
  @IsIn([WorkSuspensionType.WHOLE_DAY, WorkSuspensionType.TIME_OF_DAY])
  suspensionType: WorkSuspensionType;

  @ValidateIf((o) => o.suspensionType === WorkSuspensionType.TIME_OF_DAY)
  @Matches(TIME_PATTERN, { message: 'suspensionStartTime must be HH:mm or HH:mm:ss' })
  suspensionStartTime?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  memoNo?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateWorkSuspensionDto extends PartialType(CreateWorkSuspensionDto) {}
