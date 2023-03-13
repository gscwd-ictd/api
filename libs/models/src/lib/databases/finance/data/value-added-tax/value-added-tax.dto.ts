import { ProjectDetails } from '@gscwd-api/models';
import { PartialType } from '@nestjs/swagger';
import { IsDecimal, IsUUID } from 'class-validator';

export class CreateValueAddedTaxDto {
  @IsUUID()
  projectDetails: ProjectDetails;

  @IsDecimal()
  percentage: number;
}

export class UpdateValueAddedTaxDto extends PartialType(CreateValueAddedTaxDto) {}
