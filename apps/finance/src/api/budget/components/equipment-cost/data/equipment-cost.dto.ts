import { ProjectDetail } from '../../project-detail';

export class CreateEquipmentCostDto {
  projectDetail: ProjectDetail;
  equipmentDescription: string;
  numberOfUnit: number;
  numberOfDays: number;
  unitCost: number;
  amount: number;
}

export class UpdateEquipmentCostDto extends CreateEquipmentCostDto {}
