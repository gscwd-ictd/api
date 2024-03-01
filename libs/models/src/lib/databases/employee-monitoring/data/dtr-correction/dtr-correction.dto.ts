import { DtrCorrectionStatus } from '@gscwd-api/utils';

export class CreateDtrCorrectionDto {
  id: string;
  dtrId: string;
  timeIn: number;
  lunchOut: number;
  lunchIn: number;
  timeOut: number;
  status: DtrCorrectionStatus;
  remarks: string;
}
