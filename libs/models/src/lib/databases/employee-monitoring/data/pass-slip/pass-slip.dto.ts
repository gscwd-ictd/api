import { NatureOfBusiness, ObTransportation } from '@gscwd-api/utils';
import { PickType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PassSlipApprovalDto } from '../pass-slip-approval';

export class PassSlipDto {
  @IsUUID()
  employeeId: string;

  @IsOptional()
  @IsDateString()
  dateOfApplication?: Date;

  @IsEnum(NatureOfBusiness)
  natureOfBusiness: NatureOfBusiness;

  @IsOptional()
  @IsEnum(ObTransportation)
  obTransportation: ObTransportation;

  @IsOptional()
  @IsNumber()
  estimateHours?: number;

  @IsString()
  purposeDestination: string;

  @IsOptional()
  @IsBoolean()
  isCancelled?: boolean;

  @IsOptional()
  @IsNotEmpty()
  approval?: PassSlipApprovalDto;
}

export class UpdatePassSlipTimeRecordDto {
  @IsUUID(4)
  id: string;

  @IsString()
  action: 'time in' | 'time out';
}
