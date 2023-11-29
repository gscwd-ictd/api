import { Body, Controller, Patch } from '@nestjs/common';
import { TrainingNoticeExternalDto, TrainingNoticeInternalDto } from '@gscwd-api/models';
import { TrainingNoticesService } from './training-notices.service';

@Controller({ version: '1', path: 'training-notices' })
export class TrainingNoticesController {
  constructor(private readonly trainingNoticesService: TrainingNoticesService) {}

  @Patch('internal')
  async updateTrainingInternalById(@Body() data: TrainingNoticeInternalDto) {
    return await this.trainingNoticesService.sendTrainingInternal(data);
  }

  @Patch('external')
  async updateTrainingExternalById(@Body() data: TrainingNoticeExternalDto) {
    return await this.trainingNoticesService.sendTrainingExternal(data);
  }
}
