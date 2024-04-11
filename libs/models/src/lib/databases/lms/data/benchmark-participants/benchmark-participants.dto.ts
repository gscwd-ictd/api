import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class ParticipantsDto {
  @IsNotEmpty()
  @IsUUID('all')
  employeeId: string;
}

export class CreateBenchmarkParticipantsDto extends PartialType(ParticipantsDto) {
  @IsNotEmpty()
  @IsUUID('4')
  benchmark: string;
}

export class UpdateBenchmarkParticipantsDto extends PartialType(CreateBenchmarkParticipantsDto) {
  @IsNotEmpty()
  @IsBoolean()
  learningApplicationPlan: boolean;
}
