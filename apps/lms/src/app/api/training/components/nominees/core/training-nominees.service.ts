import { CrudHelper, CrudService } from '@gscwd-api/crud';
import {
  CreateTrainingBatchDto,
  CreateTrainingNomineeDto,
  TrainingDetails,
  TrainingDistribution,
  TrainingNominee,
  UpdateTrainingBatchDto,
} from '@gscwd-api/models';
import { NomineeType, TrainingDistributionStatus, TrainingNomineeStatus, TrainingStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HrmsEmployeesService } from '../../../../../services/hrms';
import { DataSource, EntityManager, IsNull, MoreThan, Not } from 'typeorm';
import { TrainingDetailsService } from '../../../core/training-details.service';
import { TrainingDistributionsService } from '../../../../training/components/slot-distributions';
import { TrainingRequirementsService } from '../../training-requirements';

@Injectable()
export class TrainingNomineesService extends CrudHelper<TrainingNominee> {
  constructor(
    private readonly crudService: CrudService<TrainingNominee>,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly trainingDetailsService: TrainingDetailsService,
    private readonly hrmsEmployeesService: HrmsEmployeesService,
    private readonly trainingRequirementsService: TrainingRequirementsService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  /* insert training nominees */
  async createNominees(data: CreateTrainingNomineeDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { employees, trainingDistribution } = data;

        await this.trainingDistributionsService
          .crud()
          .transact<TrainingDistribution>(entityManager)
          .update({
            updateBy: {
              id: trainingDistribution.id,
            },
            dto: {
              status: TrainingDistributionStatus.NOMINATION_COMPLETE,
            },
            onError: (error) => {
              throw error;
            },
          });

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
  async findAllTrainingByEmployeeId(employeeId: string, status: TrainingNomineeStatus) {
    const training = (await this.crudService.findAll({
      find: {
        relations: {
          trainingDistribution: { trainingDetails: { trainingDesign: true } },
        },
        select: {
          id: true,
          trainingDistribution: {
            id: true,
            supervisorId: true,
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
          batchNumber: true,
          trainingStart: true,
          trainingEnd: true,
          status: true,
          remarks: true,
        },
        where: [
          {
            employeeId,
            status,
            nomineeType: NomineeType.NOMINEE,
            trainingDistribution: { trainingDetails: { status: TrainingStatus.ON_GOING_NOMINATION } },
          },
          {
            employeeId,
            status,
            nomineeType: NomineeType.NOMINEE,
            trainingDistribution: { trainingDetails: { status: TrainingStatus.UPCOMING } },
          },
        ],
      },
      onError: (error) => {
        throw error;
      },
    })) as Array<TrainingNominee>;

    return await Promise.all(
      training.map(async (trainingItems) => {
        const supervisorName = await this.hrmsEmployeesService.findEmployeesById(trainingItems.trainingDistribution.supervisorId);

        return {
          supervisorName: supervisorName.fullName,
          nomineeId: trainingItems.id,
          name:
            trainingItems.trainingDistribution.trainingDetails.courseTitle ||
            trainingItems.trainingDistribution.trainingDetails.trainingDesign.courseTitle,
          location: trainingItems.trainingDistribution.trainingDetails.location,
          trainingStart: trainingItems.trainingDistribution.trainingDetails.trainingStart,
          trainingEnd: trainingItems.trainingDistribution.trainingDetails.trainingEnd,
          nomineeStatus: trainingItems.status,
          remarks: trainingItems.remarks,
          batchNumber: trainingItems.batchNumber,
          batchStart: trainingItems.trainingStart,
          batchEnd: trainingItems.trainingEnd,
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
          trainingDistribution: {
            trainingDetails: { id: trainingId, status: Not(TrainingStatus.PENDING) },
          },
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
          remarks: distributionItems.remarks,
          supervisor: {
            supervisorId: distributionItems.trainingDistribution.supervisorId,
            name: supervisorName.fullName,
          },
        };
      })
    );
  }

  // find all accepted training nominee by training id (nominee type = nominee & preparation status = for batching)
  async findAllAcceptedNomineeByTrainingId(trainingId: string) {
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
          status: TrainingNomineeStatus.ACCEPTED,
          batchNumber: IsNull(),
          trainingDistribution: {
            trainingDetails: { id: trainingId, status: TrainingStatus.FOR_BATCHING },
          },
        },
      },
      onError: () => new NotFoundException(),
    })) as Array<TrainingNominee>;

    return await Promise.all(
      distribution.map(async (distributionItems) => {
        const supervisorName = await this.hrmsEmployeesService.findEmployeesById(distributionItems.trainingDistribution.supervisorId);
        const employeeName = await this.hrmsEmployeesService.findEmployeesById(distributionItems.employeeId);

        return {
          nomineeId: distributionItems.id,
          employeeId: distributionItems.employeeId,
          name: employeeName.fullName,
          status: distributionItems.status,
          remarks: distributionItems.remarks,
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
          trainingDistribution: { id: distributionId, trainingDetails: { status: Not(TrainingStatus.PENDING) } },
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
          nomineeType: distributionItems.nomineeType,
          status: distributionItems.status,
          remarks: distributionItems.remarks,
        };
      })
    );
  }

  // create training nominee batching
  async createTrainingNomineeBatch(data: CreateTrainingBatchDto) {
    try {
      const { trainingId, batches } = data;
      // transaction result

      return await this.datasource.transaction(async (entityManager) => {
        //update training details preparation status
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
            updateBy: { id: trainingId },
            dto: {
              status: TrainingStatus.DONE_BATCHING,
            },
            onError: (error) => {
              throw error;
            },
          });

        //map data
        await Promise.all(
          batches.map(async (batchItems) => {
            //deconstruct batch items
            const { employees, batchNumber, trainingDate } = batchItems;

            return await Promise.all(
              employees.map(async (employeeItems) => {
                //deconstruct employee items
                const { nomineeId } = employeeItems;

                //transaction update
                return await this.crudService.transact<TrainingNominee>(entityManager).update({
                  updateBy: { id: nomineeId.id },
                  dto: {
                    batchNumber: batchNumber,
                    trainingStart: trainingDate.from,
                    trainingEnd: trainingDate.to,
                  },
                  onError: (error) => {
                    throw error;
                  },
                });
              })
            );
          })
        );

        return data;
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // find all accepted training batch nominees by training id
  async findAllBatchByTrainingId(trainingId: string) {
    try {
      const batch = (await this.crudService.findAll({
        find: {
          relations: { trainingDistribution: true },
          select: {
            id: true,
            batchNumber: true,
            trainingStart: true,
            trainingEnd: true,
            employeeId: true,
            trainingDistribution: {
              id: true,
              supervisorId: true,
            },
          },
          order: {
            batchNumber: 'ASC',
          },
          where: {
            batchNumber: Not(IsNull()),
            trainingDistribution: { trainingDetails: { id: trainingId } },
          },
        },
      })) as Array<TrainingNominee>;

      const distinctBatch = (await Promise.all(
        batch.filter((obj, index, self) => index === self.findIndex((t) => t.batchNumber === obj.batchNumber))
      )) as Array<TrainingNominee>;

      return await Promise.all(
        distinctBatch.map(async (batchItems) => {
          const batchEmployees = (await this.crudService.findAll({
            find: {
              relations: { trainingDistribution: true },
              select: {
                id: true,
                employeeId: true,
                trainingDistribution: {
                  id: true,
                  supervisorId: true,
                },
              },
              where: {
                batchNumber: batchItems.batchNumber,
                trainingDistribution: { trainingDetails: { id: trainingId } },
              },
            },
          })) as Array<TrainingNominee>;

          const employees = await Promise.all(
            batchEmployees.map(async (employeeItems) => {
              const supervisorName = await this.hrmsEmployeesService.findEmployeesById(employeeItems.trainingDistribution.supervisorId);
              const employeeName = await this.hrmsEmployeesService.findEmployeesById(employeeItems.employeeId);

              return {
                nomineeId: employeeItems.id,
                employeeId: employeeItems.employeeId,
                name: employeeName.fullName,
                distributionId: employeeItems.trainingDistribution.id,
                supervisor: {
                  supervisorId: employeeItems.trainingDistribution.supervisorId,
                  name: supervisorName.fullName,
                },
              };
            })
          );

          return {
            batchNumber: batchItems.batchNumber,
            trainingDate: {
              from: batchItems.trainingStart,
              to: batchItems.trainingEnd,
            },
            employees,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // update training nominee batch
  async updateTrainingNomineeBatch(data: UpdateTrainingBatchDto) {
    try {
      // transaction result
      return await this.datasource.transaction(async (entityManager) => {
        //map data
        await Promise.all(
          data.batches.map(async (batchItems) => {
            //deconstruct batch items
            const { employees, batchNumber, trainingDate } = batchItems;

            return await Promise.all(
              employees.map(async (employeeItems) => {
                //deconstruct employee items
                const { nomineeId } = employeeItems;

                await this.trainingRequirementsService.create({ nomineeId }, entityManager);

                //transaction update
                return await this.crudService.transact<TrainingNominee>(entityManager).update({
                  updateBy: { id: nomineeId.id },
                  dto: { batchNumber: batchNumber, trainingStart: trainingDate.from, trainingEnd: trainingDate.to },
                  onError: (error) => {
                    throw error;
                  },
                });
              })
            );
          })
        );

        return data;
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // remove training nominee service
  async remove(trainingId: string, softDelete: boolean, entityManager: EntityManager) {
    return await this.crudService.transact<TrainingNominee>(entityManager).delete({
      deleteBy: { trainingDistribution: { trainingDetails: { id: trainingId } } },
      softDelete: softDelete,
      onError: (error) => {
        throw error;
      },
    });
  }

  async findAll(trainingId: string) {
    try {
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
            status: TrainingNomineeStatus.ACCEPTED,
            trainingDistribution: {
              trainingDetails: { id: trainingId, status: MoreThan(TrainingStatus.ON_GOING_NOMINATION) },
            },
          },
        },
        onError: () => new NotFoundException(),
      })) as Array<TrainingNominee>;

      return await Promise.all(
        distribution.map(async (distributionItems) => {
          const supervisorName = await this.hrmsEmployeesService.findEmployeesById(distributionItems.trainingDistribution.supervisorId);
          const employeeName = await this.hrmsEmployeesService.findEmployeesById(distributionItems.employeeId);

          return {
            nomineeId: distributionItems.id,
            employeeId: distributionItems.employeeId,
            name: employeeName.fullName,
            status: distributionItems.status,
            remarks: distributionItems.remarks,
            supervisor: {
              supervisorId: distributionItems.trainingDistribution.supervisorId,
              name: supervisorName.fullName,
            },
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
