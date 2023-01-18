import { OmitType, PartialType } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsString, IsUUID, MaxLength } from 'class-validator';
import { ProjectDetail } from '../../project-detail';

export class CreateEquipmentCostDto {
  @IsUUID()
  projectDetail: ProjectDetail;

  @IsString()
  @MaxLength(50, { message: 'Equipment description name is too long.' })
  equipmentDescription: string;

  @IsInt()
  numberOfUnit: number;

  @IsInt()
  numberOfDays: number;

  @IsDecimal()
  unitCost: number;

  @IsDecimal()
  amount: number;
}

export class UpdateEquipmentCostDto extends PartialType(OmitType(CreateEquipmentCostDto, ['projectDetail'] as const)) {}
