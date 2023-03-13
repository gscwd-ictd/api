import { OmitType, PartialType } from '@nestjs/swagger';
import { IsCurrency, IsDecimal, IsInt, IsUUID } from 'class-validator';
import { ProjectDetails } from '../../project-details';

export class CreateLaborCostDto {
  @IsUUID()
  projectDetail: ProjectDetails;

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
