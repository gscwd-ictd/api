import { NatureOfBusiness, ObTransportation } from '@gscwd-api/utils';
import { PickType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { PassSlipApprovalDto } from '../pass-slip-approval';

export class PassSlipDto {
  @IsUUID()
  employeeId: string;

  @IsDate()
  dateOfApplication: Date;

  @IsEnum(NatureOfBusiness)
  natureOfBusiness: NatureOfBusiness;

  @IsOptional()
  @IsEnum(ObTransportation)
  obTransportation: ObTransportation;

  @IsNumber({ allowNaN: true })
  estimateHours: number;

  @IsString()
  purposeDestination: string;

  @IsBoolean()
  isCancelled: boolean;

  @IsNotEmpty()
  approval: PassSlipApprovalDto;
}

export class UpdatePassSlipTimeRecordDto {
  id: string;

  action: 'time in' | 'time out';
}
