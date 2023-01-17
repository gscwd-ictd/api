import { OmitType, PartialType } from '@nestjs/swagger';
import { IsDecimal, IsUUID } from 'class-validator';
import { ProjectDetail } from '../../project-detail';

export class CreateValueAddedTaxDto {
  @IsUUID()
  projectDetail: ProjectDetail;

  @IsDecimal()
  percentage: number;
}

export class UpdateValueAddedTaxDto extends PartialType(OmitType(CreateValueAddedTaxDto, ['projectDetail'] as const)) {}
