import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';

export class OtherTrainingRequirementsDto {
  @IsString({ message: 'training requirements must be a string' })
  document: string;

  @IsBoolean({ message: 'training requirements is selected must be a boolean' })
  isSelected: boolean;
}

export class CreateOtherTrainingParticipantsRequirementsDto {
  @IsNotEmpty()
  @IsUUID(4)
  otherTrainingParticipant: string;
}

export class UpdateOtherTrainingParticipantsRequirementsDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherTrainingRequirementsDto)
  trainingRequirements: Array<OtherTrainingRequirementsDto>;
}
