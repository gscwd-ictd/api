import {
  CreateBudgetDetailsDto,
  CreateEquipmentCostDto,
  CreateLaborCostDto,
  CreateMaterialCostDto,
  CreateProjectDetailsDto,
} from '@gscwd-api/models';
import { Type } from 'class-transformer';
import { IsArray, IsObject, ValidateNested } from 'class-validator';

export class CreateCostEstimateDto {
  @ValidateNested()
  @IsObject()
  @Type(() => CreateBudgetDetailsDto)
  budgetDetails: CreateBudgetDetailsDto;

  @ValidateNested()
  @IsObject()
  @Type(() => CreateProjectDetailsDto)
  projectDetails: CreateProjectDetailsDto;

  @ValidateNested()
  @IsArray()
  @Type(() => CreateMaterialCostDto)
  materialCost: CreateMaterialCostDto[];

  @ValidateNested()
  @IsArray()
  @Type(() => CreateLaborCostDto)
  laborCost: CreateLaborCostDto[];

  @ValidateNested()
  @IsArray()
  @Type(() => CreateEquipmentCostDto)
  equipmentCost: CreateEquipmentCostDto[];
}
