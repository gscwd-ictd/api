import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateContraAccountDto {
  @IsString({ message: 'general ledger cotra account type code must be a string' })
  @Length(1, 1, { message: 'account group code must be 2 characters long' })
  code: string;

  @IsString({ message: 'general ledger cotra account type name must be a string' })
  @Length(1, 50, { message: 'general ledger cotra account type name must be between 1 to 50 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'general ledger cotra account type description must be a string' })
  description: string;
}

export class UpdateContraAccountDto extends PartialType(CreateContraAccountDto) {}
