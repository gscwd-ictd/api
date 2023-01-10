import { ProjectDetail } from '../../project-details';

export class CreateValueAddedTaxDto {
  projectDetail: ProjectDetail;
  percentage: number;
}

export class UpdateValueAddedTaxDto {
  percentage: number;
}
