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
  async trainingSignatories(currentUser: string) {
    try {
      const user = await this.hrmsEmployeesService.findEmployeeDetailsWithSignatureByEmployeeId(currentUser);
      const signatories = await this.hrmsEmployeesService.trainingSinatories(true);
      return {
        signatories: {
          currnetUser: {
            name: user.employeeFullName,
            signature: user.signatureUrl,
            position: user.assignment.positionTitle,
          },
          ...signatories,
        },
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request.', HttpStatus.BAD_REQUEST);
    }
  }
}
