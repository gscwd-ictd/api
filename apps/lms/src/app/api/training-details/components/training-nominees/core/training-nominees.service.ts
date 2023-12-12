import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingNomineeDto, TrainingNominee } from '@gscwd-api/models';
import { NomineeType, TrainingNomineeStatus, TrainingPreparationStatus } from '@gscwd-api/utils';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HrmsEmployeesService } from '../../../../../services/hrms';
import { DataSource, Not } from 'typeorm';

@Injectable()
export class TrainingNomineesService extends CrudHelper<TrainingNominee> {
  constructor(
    private readonly crudService: CrudService<TrainingNominee>,
    private readonly hrmsEmployeesService: HrmsEmployeesService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  //insert training nominees
  async create(data: CreateTrainingNomineeDto) {
    try {
      //transaction result
      return await this.datasource.transaction(async (entityManager) => {
        const { employees, trainingDistribution } = data;
        return await Promise.all(
          employees.map(async (employeeItem) => {
            return await this.crudService.transact<TrainingNominee>(entityManager).create({
              dto: { trainingDistribution, ...employeeItem },
              onError: (error) => {
                throw error;
              },
            });
          })
        );
      });
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }

  // find all training by employee id
  async findAllTrainingByEmployeeId(employeeId: string) {
    const training = (await this.crudService.findAll({
      find: {
        relations: {
          trainingDistribution: { trainingDetails: { trainingDesign: true } },
        },
        select: {
          id: true,
          trainingDistribution: {
            id: true,
            trainingDetails: {
              id: true,
              trainingDesign: { courseTitle: true },
              courseTitle: true,
              location: true,
              trainingStart: true,
              trainingEnd: true,
              source: { name: true },
              type: true,
            },
          },
        },
        where: {
          employeeId,
          status: TrainingNomineeStatus.PENDING,
          nomineeType: NomineeType.NOMINEE,
          trainingDistribution: { trainingDetails: { trainingPreparationStatus: TrainingPreparationStatus.ON_GOING_NOMINATION } },
        },
      },
      onError: (error) => {
        throw error;
      },
    })) as Array<TrainingNominee>;

    return await Promise.all(
      training.map(async (trainingItems) => {
        return {
          nomineeId: trainingItems.id,
          name:
            trainingItems.trainingDistribution.trainingDetails.courseContent ||
            trainingItems.trainingDistribution.trainingDetails.trainingDesign.courseTitle,
          location: trainingItems.trainingDistribution.trainingDetails.location,
          trainingStart: trainingItems.trainingDistribution.trainingDetails.trainingStart,
          trainingEnd: trainingItems.trainingDistribution.trainingDetails.trainingEnd,
        };
      })
    );
  }

  // find all training nominee by training id (nominee type = nominee)
  async findAllNomineeByTrainingId(trainingId: string) {
    const distribution = (await this.crudService.findAll({
      find: {
        relations: { trainingDistribution: true },
        select: {
          id: true,
          trainingDistribution: {
            id: true,
            supervisorId: true,
          },
          employeeId: true,
          status: true,
          nomineeType: true,
          remarks: true,
        },
        where: {
          nomineeType: NomineeType.NOMINEE,
          trainingDistribution: { trainingDetails: { id: trainingId, trainingPreparationStatus: Not(TrainingPreparationStatus.PENDING) } },
        },
      },
      onError: () => new NotFoundException(),
    })) as Array<TrainingNominee>;

    return await Promise.all(
      distribution.map(async (distributionItems) => {
        const supervisorName = await this.hrmsEmployeesService.findEmployeesById(distributionItems.trainingDistribution.supervisorId);
        const employeeName = await this.hrmsEmployeesService.findEmployeesById(distributionItems.employeeId);

        return {
          employeeId: distributionItems.employeeId,
          name: employeeName.fullName,
          status: distributionItems.status,
          supervisor: {
            supervisorId: distributionItems.trainingDistribution.supervisorId,
            name: supervisorName.fullName,
          },
        };
      })
    );
  }

  // find all training nominee by distribution id (nominee type = nominee or stand-in)
  async findAllNomineesByDistributionId(distributionId: string, type: NomineeType) {
    const distribution = (await this.crudService.findAll({
      find: {
        relations: { trainingDistribution: true },
        select: {
          id: true,
          trainingDistribution: {
            id: true,
            supervisorId: true,
          },
          employeeId: true,
          status: true,
          nomineeType: true,
          remarks: true,
        },
        where: {
          nomineeType: type,
          trainingDistribution: { id: distributionId, trainingDetails: { trainingPreparationStatus: Not(TrainingPreparationStatus.PENDING) } },
        },
      },
      onError: () => new NotFoundException(),
    })) as Array<TrainingNominee>;

    return await Promise.all(
      distribution.map(async (distributionItems) => {
        const employeeName = await this.hrmsEmployeesService.findEmployeesById(distributionItems.employeeId);

        return {
          employeeId: distributionItems.employeeId,
          name: employeeName.fullName,
        };
      })
    );
  }
}
