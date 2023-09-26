import { TrainingType } from '@gscwd-api/utils';
import { TrainingSource } from '../training-sources';
import { LspDetails } from '../lsp-details';
import { IsEnum, IsUUID } from 'class-validator';
import { TrainingDesign } from '../training-designs';
import { TrainingDetails } from '../training-details';

export class CreateTrainingInternalDto {
  @IsUUID('4')
  trainingDesign: TrainingDesign;

  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsEnum(TrainingType)
  trainingType: TrainingType;

  @IsUUID('4')
  lspDetails: LspDetails;
}

export class CreateTrainingExternalDto {
  @IsUUID('4')
  trainingDetails: TrainingDetails;

  @IsUUID('4')
  trainingSource: TrainingSource;

  @IsEnum(TrainingType)
  trainingType: TrainingType;

  @IsUUID('4')
  lspDetails: LspDetails;
}
