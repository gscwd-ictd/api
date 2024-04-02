import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TrainingDetailsService } from '../../training';
import { TrainingNomineeStatus, TrainingStatus } from '@gscwd-api/utils';
import { TrainingNomineesService } from '../../training/components/nominees';
import { Raw } from 'typeorm';
import { HrmsEmployeesService } from '../../../services/hrms';

@Injectable()
export class StatsService {
  constructor(
    private readonly trainingDetailsService: TrainingDetailsService,
    private readonly trainingNomineesService: TrainingNomineesService,
    private readonly hrmsEmployeesService: HrmsEmployeesService
  ) {}

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

  async countAcceptedNominees() {
    try {
      const currentYear = new Date().getFullYear();

      const organization = await this.hrmsEmployeesService.findAllOrganization();

      const totalCountByDepartment = await Promise.all(
        organization.map(async (items) => {
          const employees = await this.hrmsEmployeesService.findAllEmployeesByOrganizationId(items._id);

          const count = await Promise.all(
            employees.map(async (items) => {
              return await this.trainingNomineesService
                .crud()
                .getRepository()
                .countBy({
                  employeeId: items.value,
                  status: TrainingNomineeStatus.ACCEPTED,
                  updatedAt: Raw((alias) => `extract(year from ${alias}) = :currentYear`, { currentYear: currentYear }),
                });
            })
          );

          const totalCount = count.reduce((total, count) => total + count, 0);

          return {
            department: items.name,
            count: totalCount,
          };
        })
      );

      return {
        totalCountByDepartment: totalCountByDepartment,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
