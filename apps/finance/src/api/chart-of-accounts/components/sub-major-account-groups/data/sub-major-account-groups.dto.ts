import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { MajorAccountGroup } from '../../major-account-groups';

export class CreateSubMajorAccountGroupDto {
  @IsUUID(4, { message: 'major account group id is not valid' })
  majorAccountGroup: MajorAccountGroup;

  @IsString({ message: 'sub major account group code must be a string' })
  @Length(2, 2, { message: 'sub major account group code must be 2 characters long' })
  code: string;

  @IsString({ message: 'sub major account group name must be a string' })
  @Length(1, 50, { message: 'sub major account group name must be between 1 to 50 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'sub major account group description must be a string' })
  description: string;
}

export class UpdateSubMajorAccountGroupDto extends PartialType(CreateSubMajorAccountGroupDto) {}
