import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';
import { Contigency } from '../contingencies';
import { ProjectDetails } from '../project-details';

export class CreateEquipmentCostDto {
  @IsUUID()
  projectDetails: ProjectDetails;

  @IsUUID()
  contingency: Contigency;

  @IsString()
  @MaxLength(50, { message: 'Equipment description name is too long.' })
  equipmentDescription: string;

  @IsInt()
  numberOfUnit: number;

  @IsInt()
  numberOfDays: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  unitCost: number;
}

export class UpdateEquipmentCostDto extends PartialType(CreateEquipmentCostDto) {}
