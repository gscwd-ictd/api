import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingDistributionDto, TrainingDistribution } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager, MoreThan } from 'typeorm';
import { TrainingRecommendedEmployeeService } from '../../recommended-employees';
import { HrmsEmployeesService } from '../../../../../services/hrms/employees';
import { TrainingDistributionStatus, TrainingStatus } from '@gscwd-api/utils';

@Injectable()
export class TrainingDistributionsService extends CrudHelper<TrainingDistribution> {
  constructor(
    private readonly crudService: CrudService<TrainingDistribution>,
    private readonly trainingRecommendedEmployeesService: TrainingRecommendedEmployeeService,
    private readonly hrmsEmployeesService: HrmsEmployeesService
  ) {
    super(crudService);
  }

  /* find all training slot distributions by training id */
  async findAllDistributionByTrainingId(trainingId: string) {
    try {
      /* find all slot distribution */
      const slotDistribution = (await this.crudService.findAll({
        find: {
          select: {
            id: true,
            supervisorId: true,
            numberOfSlots: true,
          },
          where: {
            trainingDetails: { id: trainingId },
            numberOfSlots: MoreThan(0),
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingDistribution>;

      /* custom return */
      return await Promise.all(
        slotDistribution.map(async (items) => {
          /* find supervisor name by employee id */
          const supervisorName = (await this.hrmsEmployeesService.findEmployeesById(items.supervisorId)).fullName;

          /* find all recommended employees by distribution id */
          const recommendedEmployees = await this.trainingRecommendedEmployeesService.findAllRecommendedEmployeesByDistributionId(items.id);

          /* custom return */
          return {
            supervisor: {
              supervisorId: items.supervisorId,
              name: supervisorName,
            },
            numberOfSlots: items.numberOfSlots,
            employees: recommendedEmployees,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* insert training slot distributions */
  async createSlotDistributions(data: CreateTrainingDistributionDto, entityManager: EntityManager) {
    try {
      const { employees, supervisor, ...rest } = data;

      const trainingDistribution = await this.crudService.transact<TrainingDistribution>(entityManager).create({
        dto: {
          ...rest,
          supervisorId: supervisor.supervisorId,
        },
        onError: (error) => {
          throw error;
        },
      });

      /* insert training recommended employees */
      await Promise.all(
        employees.map(async (items) => {
          return await this.trainingRecommendedEmployeesService.createRecommendedEmployees({ trainingDistribution, ...items }, entityManager);
        })
      );

      return data;
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* remove all training slot distributions by training id */
  async deleteAllDistributionByTrainingId(trainingId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<TrainingDistribution>(entityManager).delete({
        deleteBy: {
          trainingDetails: { id: trainingId },
        },
        softDelete: false,
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* microservices for employees portal */

  /* find all distributed training by supervisor id */
  async findAllDistributionBySupervisorId(supervisorId: string) {
    try {
      const trainingDetails = (await this.crudService.findAll({
        find: {
          relations: {
            trainingDetails: {
              trainingDesign: true,
              source: true,
            },
          },
          select: {
            id: true,
            numberOfSlots: true,
            status: true,
            trainingDetails: {
              id: true,
              courseTitle: true,
              trainingDesign: {
                courseTitle: true,
              },
              location: true,
              trainingStart: true,
              trainingEnd: true,
              status: true,
              type: true,
              source: {
                name: true,
              },
            },
          },
          where: {
            supervisorId: supervisorId,
            trainingDetails: { status: MoreThan(TrainingStatus.PENDING) },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingDistribution>;

      return await Promise.all(
        trainingDetails.map(async (items) => {
          return {
            distributionId: items.id,
            numberOfSlots: items.numberOfSlots,
            trainingId: items.trainingDetails.id,
            courseTitle: items.trainingDetails.courseTitle || items.trainingDetails.trainingDesign.courseTitle,
            location: items.trainingDetails.location,
            trainingStart: items.trainingDetails.trainingStart,
            trainingEnd: items.trainingDetails.trainingEnd,
            source: items.trainingDetails.source.name,
            type: items.trainingDetails.type,
            status: items.trainingDetails.status,
            nominationStatus: items.status,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* count pending nomination by supervisor id */
  async countPendingNominationBySupervisorId(supervisorId: string) {
    try {
      const count = await this.crudService.getRepository().countBy({
        numberOfSlots: MoreThan(0),
        status: TrainingDistributionStatus.NOMINATION_PENDING,
        supervisorId: supervisorId,
      });

      return {
        nominationPending: count,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
