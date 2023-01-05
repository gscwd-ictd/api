import { ProjectDetail } from '../../project-details';

export class CreateEquipmentCostDto {
  projectDetail: ProjectDetail;
  equipmentDescription: string;
  numberOfUnit: number;
  numberOfDays: number;
  unitCost: number;
  amount: number;
}

export class UpdateEquipmentCostDto extends CreateEquipmentCostDto {}
