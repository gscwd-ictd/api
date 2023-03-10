import { LeaveTypes, CreditDistribution } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLeaveBenefitsDto {
  @IsString({ message: 'Please specify leave name' })
  leaveName: string;

  @IsEnum(LeaveTypes, { message: 'Invalid Leave Type.' })
  leaveType: LeaveTypes;

  @IsOptional()
  @IsNumber({ allowNaN: false }, { message: 'Invalid accumulated credits.' })
  accumulatedCredits: number;

  @IsEnum(CreditDistribution, { message: 'Invalid Credit Distribution' })
  creditDistribution: CreditDistribution;

  @IsBoolean({ message: 'isMonetizable value must only be true of false' })
  isMonetizable: boolean;

  @IsBoolean({ message: 'canBeCarriedOver value must only be true of false' })
  canBeCarriedOver: boolean;
}

export class UpdateLeaveBenefitsDto extends PartialType(CreateLeaveBenefitsDto) {}
