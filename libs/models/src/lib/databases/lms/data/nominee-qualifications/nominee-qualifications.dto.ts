import { IsString } from 'class-validator';

export class NomineeQualificationsDto {
  @IsString()
  nomineeQualifications: string;
}
