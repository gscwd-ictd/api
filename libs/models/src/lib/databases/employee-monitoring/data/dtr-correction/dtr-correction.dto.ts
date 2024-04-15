import { DailyTimeRecord } from '@gscwd-api/models';
import { DtrCorrectionStatus } from '@gscwd-api/utils';
import { PickType } from '@nestjs/swagger';

export class CreateDtrCorrectionDto {
  id: string;
  dtrId: DailyTimeRecord;
  timeIn: number;
  lunchOut: number;
  lunchIn: number;
  timeOut: number;
  status: DtrCorrectionStatus;
  remarks: string;
}

export class ApproveDtrCorrectionDto extends PickType(CreateDtrCorrectionDto, ['id', 'status']) {}
