import { Contigency, ProjectDetails } from '@gscwd-api/models';
import { PartialType } from '@nestjs/swagger';
import { IsCurrency, IsInt, IsUUID } from 'class-validator';

export class CreateMaterialCostDto {
  @IsUUID()
  projectDetails: ProjectDetails;

  @IsUUID()
  contingency: Contigency;

  @IsUUID()
  specificationId: string;

  @IsInt()
  quantity: number;

  @IsCurrency()
  unitCost: number;

  @IsCurrency()
  amount: number;
}

export class UpdateMaterialCostDto extends PartialType(CreateMaterialCostDto) {}
