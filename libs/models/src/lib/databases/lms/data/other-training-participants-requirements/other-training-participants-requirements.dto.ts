import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';

export class OtherTrainingRequirementsDto {
  @IsString({ message: 'training requirements must be a string' })
  document: string;
}

export class CreateOtherTrainingParticipantsRequirementsDto {
  @IsNotEmpty()
  @IsUUID(4)
  otherTrainingParticipant: string;
}

export class UpdateParticipantsRequirementsDto {
  @IsNotEmpty()
  @IsUUID('4')
  participantId: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherTrainingRequirementsDto)
  requirements: Array<OtherTrainingRequirementsDto>;
}

export class UpdateOtherTrainingParticipantsRequirementsDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateParticipantsRequirementsDto)
  participants: Array<UpdateParticipantsRequirementsDto>;
}
