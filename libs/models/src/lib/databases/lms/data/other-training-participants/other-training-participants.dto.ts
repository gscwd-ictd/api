import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class OtherTrainingParticipantDto {
  @IsNotEmpty()
  @IsUUID('all')
  employeeId: string;
}

export class CreateOtherTrainingParticipantsDto extends PartialType(OtherTrainingParticipantDto) {
  @IsNotEmpty()
  @IsUUID('4')
  otherTraining: string;
}
