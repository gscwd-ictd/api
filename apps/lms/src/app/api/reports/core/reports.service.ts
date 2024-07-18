import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TrainingDetailsService } from '../../training';
import { HrmsEmployeesService } from '../../../services/hrms';

@Injectable()
export class ReportsService {
  constructor(private readonly trainingDetailsService: TrainingDetailsService, private readonly hrmsEmployeesService: HrmsEmployeesService) {}

  /* find all training log */
  async findTrainingLog(dateRange: string) {
    try {
      return await this.trainingDetailsService.customFindAllTrainings(dateRange);
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* assignatories */
  async trainingSignatories() {
    try {
      return await this.hrmsEmployeesService.trainingSinatories(true);
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request.', HttpStatus.BAD_REQUEST);
    }
  }
}
