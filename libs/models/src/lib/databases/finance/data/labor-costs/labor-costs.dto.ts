import { Contigency, ProjectDetails } from '@gscwd-api/models';
import { OmitType, PartialType } from '@nestjs/swagger';
import { IsCurrency, IsDecimal, IsInt, IsUUID } from 'class-validator';

export class CreateLaborCostDto {
  @IsUUID()
  projectDetail: ProjectDetails;

  @IsUUID()
  contingency: Contigency;

  @IsUUID()
  specificationId: string;

  @IsInt()
  numberOfPerson: number;

  @IsInt()
  numberOfDay: number;

  @IsDecimal()
  unitCost: number;

  @IsCurrency()
  amount: number;
}

export class UpdateLaborCostDto extends PartialType(OmitType(CreateLaborCostDto, ['projectDetail'] as const)) {}
