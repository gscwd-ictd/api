import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class CreateBenchmarkParticipantRequirementsDto {
  @IsNotEmpty()
  @IsUUID(4)
  benchmarkParticipants: string;
}

export class UpdateBenchmarkParticipantRequirementsDto extends PartialType(CreateBenchmarkParticipantRequirementsDto) {
  @IsNotEmpty()
  @IsBoolean()
  learnersJournal: boolean;
}

export class BenchmarkParticipantRequirementsDto {
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBenchmarkParticipantRequirementsDto)
  participants: Array<UpdateBenchmarkParticipantRequirementsDto>;
}
