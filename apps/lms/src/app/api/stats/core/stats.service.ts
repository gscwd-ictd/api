import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TrainingDetailsService } from '../../training';
import { BenchmarkStatus, LspSource, LspType, OtherTrainingStatus, TrainingNomineeStatus, TrainingStatus } from '@gscwd-api/utils';
import { TrainingNomineesService } from '../../training/components/nominees';
import { Raw } from 'typeorm';
import { HrmsEmployeesService } from '../../../services/hrms';
import { BenchmarkService } from '../../benchmark';
import { OtherTrainingsService } from '../../others';
import { LspRankView } from '@gscwd-api/models';
import { CrudService } from '@gscwd-api/crud';

@Injectable()
export class StatsService {
  constructor(
    private readonly crudService: CrudService<LspRankView>,
    private readonly trainingDetailsService: TrainingDetailsService,
    private readonly trainingNomineesService: TrainingNomineesService,
    private readonly hrmsEmployeesService: HrmsEmployeesService,
    private readonly benchmarkService: BenchmarkService,
    private readonly otherTrainingsService: OtherTrainingsService
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
                  trainingDistribution: {
                    trainingDetails: {
                      status: TrainingStatus.COMPLETED,
                    },
                  },
                  updatedAt: Raw((alias) => `extract(year from ${alias}) = :currentYear`, { currentYear: currentYear }),
                });
            })
          );

          const totalCount = count.reduce((total, count) => total + count, 0);

          return {
            code: items.code,
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

  /* count all done training */
  async countAllDoneStatus() {
    try {
      const currentYear = new Date().getFullYear();

      const training = await this.trainingDetailsService
        .crud()
        .getRepository()
        .countBy({
          status: TrainingStatus.COMPLETED,
          updatedAt: Raw((alias) => `extract(year from ${alias}) = :currentYear`, { currentYear: currentYear }),
        });

      const benchmark = await this.benchmarkService
        .crud()
        .getRepository()
        .countBy({
          status: BenchmarkStatus.DONE,
          updatedAt: Raw((alias) => `extract(year from ${alias}) = :currentYear`, { currentYear: currentYear }),
        });

      const otherTraining = await this.otherTrainingsService
        .crud()
        .getRepository()
        .countBy({
          status: OtherTrainingStatus.COMPLETED,
          updatedAt: Raw((alias) => `extract(year from ${alias}) = :currentYear`, { currentYear: currentYear }),
        });

      return {
        training: training,
        benchmark: benchmark,
        otherTraining: otherTraining,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* count all accepted and declined participants */
  async countAllParticipants() {
    try {
      const currentYear = new Date().getFullYear();

      const trainingAccepted = await this.trainingNomineesService
        .crud()
        .getRepository()
        .countBy({
          status: TrainingNomineeStatus.ACCEPTED,
          trainingDistribution: {
            trainingDetails: {
              status: TrainingStatus.COMPLETED,
            },
          },
          updatedAt: Raw((alias) => `extract(year from ${alias}) = :currentYear`, { currentYear: currentYear }),
        });

      const trainingDeclined = await this.trainingNomineesService
        .crud()
        .getRepository()
        .countBy({
          status: TrainingNomineeStatus.DECLINED,
          trainingDistribution: {
            trainingDetails: {
              status: TrainingStatus.COMPLETED,
            },
          },
          updatedAt: Raw((alias) => `extract(year from ${alias}) = :currentYear`, { currentYear: currentYear }),
        });

      return {
        accepted: trainingAccepted,
        declined: trainingDeclined,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* find learning service provider rating rank */
  async findAllLspAverageRating(type: LspType, source: LspSource, page: number, limit: number) {
    try {
      return await this.crudService.findAll({
        find: {
          where: {
            type: type,
            source: source,
          },
        },
        pagination: {
          page,
          limit,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
