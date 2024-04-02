import { IsDate, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateWorkSuspensionDto {
  @IsString()
  name: string;

  @IsDate()
  suspensionDate: Date;

  @IsPositive()
  @IsNumber()
  suspensionHours: number;
}
