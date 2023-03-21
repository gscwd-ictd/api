import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsUUID } from 'class-validator';
import { Contigency } from '../contingencies';
import { ProjectDetails } from '../project-details';

export class CreateMaterialCostDto {
  @IsUUID()
  projectDetails: ProjectDetails;

  @IsUUID()
  contingency: Contigency;

  @IsUUID()
  specificationId: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  unitCost: number;
}

export class UpdateMaterialCostDto extends PartialType(CreateMaterialCostDto) {}
