import { OmitType, PartialType } from '@nestjs/swagger';
import { ProjectDetail } from '../../project-detail';

export class CreateContractorProfitDto {
  projectDetail: ProjectDetail;
  percentage: number;
}

export class UpdateContractorProfitDto extends PartialType(OmitType(CreateContractorProfitDto, ['projectDetail'] as const)) {}
