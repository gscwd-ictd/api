import { OmitType, PartialType } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsString, IsUUID, MaxLength } from 'class-validator';
import { ProjectDetails } from '../../project-details';

export class CreateEquipmentCostDto {
  @IsUUID()
  projectDetail: ProjectDetails;

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
