import { OmitType, PartialType } from '@nestjs/swagger';
import { IsDecimal, IsUUID } from 'class-validator';
import { ProjectDetails } from '../../project-details';

export class CreateValueAddedTaxDto {
  @IsUUID()
  projectDetail: ProjectDetails;

  @IsDecimal()
  percentage: number;
}

export class UpdateValueAddedTaxDto extends PartialType(OmitType(CreateValueAddedTaxDto, ['projectDetail'] as const)) {}
