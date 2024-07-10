import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TrainingDetailsService } from '../../training';

@Injectable()
export class ReportsService {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  /* find all training log */
  async findTrainingLog(dateRange: string) {
    try {
      return await this.trainingDetailsService.customFindAllTrainings(dateRange);
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
