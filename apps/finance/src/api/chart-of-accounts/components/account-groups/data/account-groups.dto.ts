import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateAccountGroupDto {
  @IsString({ message: 'account group code must be a string' })
  @Length(2, 2, { message: 'account group code must be 2 characters long' })
  code: string;

  @IsString({ message: 'account group name must be a string' })
  @Length(1, 50, { message: 'account group name must be between 1 to 50 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'account group description must be a string' })
  description: string;
}

export class UpdateAccountGroupDto extends PartialType(CreateAccountGroupDto) {}
