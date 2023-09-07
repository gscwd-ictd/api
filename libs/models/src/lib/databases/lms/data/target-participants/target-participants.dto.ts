import { IsString } from 'class-validator';

export class TargetParticipants {
  @IsString()
  participant: string;
}
