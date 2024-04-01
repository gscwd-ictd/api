import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TrainingDetailsService } from '../../training';
import { TrainingStatus } from '@gscwd-api/utils';

@Injectable()
export class StatsService {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  async countTrainingStatus() {
    try {
      const upcoming = await this.trainingDetailsService.crud().getRepository().countBy({
        status: TrainingStatus.UPCOMING,
      });

      const submission = await this.trainingDetailsService.crud().getRepository().countBy({
        status: TrainingStatus.REQUIREMENTS_SUBMISSION,
      });

      const completed = await this.trainingDetailsService.crud().getRepository().countBy({
        status: TrainingStatus.COMPLETED,
      });

      return {
        upcoming: upcoming,
        submission: submission,
        done: completed,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
