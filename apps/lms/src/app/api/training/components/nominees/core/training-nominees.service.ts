import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingNomineeDto, TrainingDistribution, TrainingNominee, UpdateTrainingNomineeStatusDto } from '@gscwd-api/models';
import { NomineeType, TrainingDistributionStatus, TrainingNomineeStatus, TrainingStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HrmsEmployeesService } from '../../../../../services/hrms';
import { DataSource, MoreThanOrEqual } from 'typeorm';
import { TrainingDistributionsService } from '../../slot-distributions';

@Injectable()
export class TrainingNomineesService extends CrudHelper<TrainingNominee> {
  constructor(
    private readonly crudService: CrudService<TrainingNominee>,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly hrmsEmployeesService: HrmsEmployeesService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  /* microservices for employees portal */

  /* insert training nominees */
  async createNominees(data: CreateTrainingNomineeDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { employees, trainingDistribution } = data;

        /* count the number of employees nominated */
        const countEmployees = employees.length;

        /* set training distribution status complete or ineligible */
        const status = countEmployees === 0 ? TrainingDistributionStatus.NOMINATION_INELIGIBLE : TrainingDistributionStatus.NOMINATION_COMPLETED;

        /* edit training distribution status by id */
        await this.trainingDistributionsService
          .crud()
          .transact<TrainingDistribution>(entityManager)
          .update({
            updateBy: {
              id: trainingDistribution.id,
            },
            dto: {
              status: status,
            },
            onError: (error) => {
              throw error;
            },
          });

        /* insert training nominees */
        return await Promise.all(
          employees.map(async (items) => {
            return await this.crudService.transact<TrainingNominee>(entityManager).create({
              dto: {
                ...items,
                trainingDistribution: trainingDistribution,
              },
              onError: (error) => {
                throw error;
              },
            });
          })
        );
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* find all training nominee by distribution id (nominee type = nominee or stand-in) */
  async findAllNomineesByDistributionId(distributionId: string, nomineeType: NomineeType) {
    try {
      /* find all training training nominee */
      const distribution = (await this.crudService.findAll({
        find: {
          relations: {
            trainingDistribution: true,
          },
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
            nomineeType: nomineeType,
            trainingDistribution: {
              id: distributionId,
              trainingDetails: {
                status: MoreThanOrEqual(TrainingStatus.PENDING),
              },
            },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingNominee>;

      return await Promise.all(
        distribution.map(async (items) => {
          /* find employee name by employee id */
          const employeeName = (await this.hrmsEmployeesService.findEmployeesById(items.employeeId)).fullName;

          /* custom return */
          return {
            employeeId: items.employeeId,
            name: employeeName,
            nomineeType: items.nomineeType,
            status: items.status,
            remarks: items.remarks,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* find all training nominee by training id */
  async findAllNomineeByTrainingId(
    trainingId: string,
    trainingStatus: TrainingStatus,
    nomineeType: NomineeType,
    nomineeStatus: TrainingNomineeStatus
  ) {
    try {
      /* find all training training nominee */
      const distribution = (await this.crudService.findAll({
        find: {
          relations: {
            trainingDistribution: true,
          },
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
            nomineeType: nomineeType,
            status: nomineeStatus,
            trainingDistribution: {
              trainingDetails: {
                id: trainingId,
                status: MoreThanOrEqual(trainingStatus),
              },
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
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* find all training details by employee id */
  async findAllTrainingByEmployeeId(employeeId: string) {
    try {
      /* find all training details */
      const trainingDetails = (await this.crudService.findAll({
        find: {
          relations: {
            trainingDistribution: {
              trainingDetails: {
                trainingDesign: true,
              },
            },
          },
          select: {
            id: true,
            trainingDistribution: {
              id: true,
              supervisorId: true,
              trainingDetails: {
                id: true,
                trainingDesign: {
                  courseTitle: true,
                },
                courseTitle: true,
                location: true,
                trainingStart: true,
                trainingEnd: true,
                source: {
                  name: true,
                },
                type: true,
                status: true,
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
              employeeId: employeeId,
              nomineeType: NomineeType.NOMINEE,
              trainingDistribution: {
                trainingDetails: {
                  status: MoreThanOrEqual(TrainingStatus.ON_GOING_NOMINATION),
                },
              },
            },
          ],
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingNominee>;

      return await Promise.all(
        trainingDetails.map(async (items) => {
          /* find supervisor name by supervisor id */
          const supervisorName = (await this.hrmsEmployeesService.findEmployeesById(items.trainingDistribution.supervisorId)).fullName;

          /* custom returns */
          return {
            supervisorName: supervisorName,
            nomineeId: items.id,
            name: items.trainingDistribution.trainingDetails.courseTitle || items.trainingDistribution.trainingDetails.trainingDesign.courseTitle,
            location: items.trainingDistribution.trainingDetails.location,
            trainingStart: items.trainingDistribution.trainingDetails.trainingStart,
            trainingEnd: items.trainingDistribution.trainingDetails.trainingEnd,
            trainingStatus: items.trainingDistribution.trainingDetails.status,
            nomineeStatus: items.status,
            remarks: items.remarks,
            batchNumber: items.batchNumber,
            batchStart: items.trainingStart,
            batchEnd: items.trainingEnd,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* edit nominee status by nominee id */
  async updateTrainingNomineeStatus(data: UpdateTrainingNomineeStatusDto) {
    try {
      /* deconstruct data */
      const { nomineeId, ...rest } = data;

      /* edit nominee status */
      return await this.crudService.update({
        updateBy: {
          id: nomineeId,
        },
        dto: {
          ...rest,
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* // find all accepted training nominee by training id (nominee type = nominee & preparation status = for batching)
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
  } */
}
