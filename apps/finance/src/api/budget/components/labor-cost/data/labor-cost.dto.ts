import { OmitType, PartialType } from '@nestjs/swagger';
import { IsCurrency, IsDecimal, IsInt, IsUUID } from 'class-validator';
import { ProjectDetail } from '../../project-detail';

export class CreateLaborCostDto {
  @IsUUID()
  projectDetail: ProjectDetail;

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
