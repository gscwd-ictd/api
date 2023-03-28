import { PartialType } from '@nestjs/swagger';
import { IsDecimal, IsUUID } from 'class-validator';
import { ProjectDetails } from '../project-details';

export class CreateValueAddedTaxDto {
  @IsUUID()
  projectDetails: ProjectDetails;

  @IsDecimal()
  percentage: number;
}

export class UpdateValueAddedTaxDto extends PartialType(CreateValueAddedTaxDto) {}
