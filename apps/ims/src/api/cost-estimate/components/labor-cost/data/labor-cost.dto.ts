import { ProjectDetail } from '../../project-details';

export class CreateLaborCostDto {
  projectDetail: ProjectDetail;
  numberOfPerson: number;
  numberOfDay: number;
  unitCost: number;
  amount: number;
}

export class UpdateLaborCostDto {
  numberOfPerson: number;
  numberOfDay: number;
  unitCost: number;
  amount: number;
}
