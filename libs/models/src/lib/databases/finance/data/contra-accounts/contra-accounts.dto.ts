import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateContraAccountDto {
  @IsString({ message: 'contra account code must be a string' })
  @Length(1, 1, { message: 'contra account code must be 2 characters long' })
  code: string;

  @IsString({ message: 'contra account type name must be a string' })
  @Length(1, 50, { message: 'contra account type name must be between 1 to 50 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'contra account type description must be a string' })
  description: string;
}

export class UpdateContraAccountDto extends PartialType(CreateContraAccountDto) {}
