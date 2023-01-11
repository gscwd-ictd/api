import { ProjectDetail } from '../../project-detail';

export class CreateValueAddedTaxDto {
  projectDetail: ProjectDetail;
  percentage: number;
}

export class UpdateValueAddedTaxDto {
  percentage: number;
}
