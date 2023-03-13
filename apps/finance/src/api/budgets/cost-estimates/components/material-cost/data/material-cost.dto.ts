import { OmitType, PartialType } from '@nestjs/swagger';
import { IsCurrency, IsInt, IsUUID } from 'class-validator';
import { ProjectDetails } from '../../project-details';

export class CreateMaterialCostDto {
  @IsUUID()
  projectDetail: ProjectDetails;

  @IsUUID()
  specificationId: string;

  @IsInt()
  quantity: number;

  @IsCurrency()
  unitCost: number;

  @IsCurrency()
  amount: number;
}

export class UpdateMaterialCostDto extends PartialType(OmitType(CreateMaterialCostDto, ['projectDetail'] as const)) {}
