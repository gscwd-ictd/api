import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBenchmarkParticipantRequirementsDto {
  @IsNotEmpty()
  @IsUUID(4)
  benchmarkParticipants: string;
}

export class UpdateBenchmarkParticipantRequirementsDto extends PartialType(CreateBenchmarkParticipantRequirementsDto) {
  @IsNotEmpty()
  @IsBoolean()
  learningApplicationPlan: boolean;
}
