import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsUUID } from 'class-validator';
import { Contigency } from '../contingencies';
import { ProjectDetails } from '../project-details';

export class CreateLaborCostDto {
  @IsUUID()
  projectDetails: ProjectDetails;

  @IsUUID()
  contingency: Contigency;

  @IsUUID()
  specificationId: string;

  @IsInt()
  numberOfPerson: number;

  @IsInt()
  numberOfDays: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  unitCost: number;
}

export class UpdateLaborCostDto extends PartialType(CreateLaborCostDto) {}
