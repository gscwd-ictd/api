import { IsNotEmpty, IsUUID } from 'class-validator';

export class ParticipantsDto {
  @IsNotEmpty()
  @IsUUID('all')
  employeeId: string;
}

export class CreateBenchmarkParticipantsDto extends ParticipantsDto {
  @IsNotEmpty()
  @IsUUID('4')
  benchmark: string;
}
