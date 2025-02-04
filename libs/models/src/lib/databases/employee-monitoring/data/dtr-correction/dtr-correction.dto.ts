
import { DtrCorrectionStatus } from '@gscwd-api/utils';
import { PickType } from '@nestjs/swagger';
import { DailyTimeRecord } from '../daily-time-record';

export class CreateDtrCorrectionDto {
  id: string;
  dtrId: DailyTimeRecord;
  timeIn: number;
  lunchOut: number;
  lunchIn: number;
  timeOut: number;
  status: DtrCorrectionStatus;
  remarks: string;
  companyId: string;
  dtrDate: Date;
}

export class ApproveDtrCorrectionDto extends PickType(CreateDtrCorrectionDto, ['id', 'status']) { }
