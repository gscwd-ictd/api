import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingBatchDto, CreateTrainingNomineeDto, TrainingNominee, UpdateTrainingBatchDto } from '@gscwd-api/models';
import { NomineeType, TrainingNomineeStatus, TrainingPreparationStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HrmsEmployeesService } from '../../../../../services/hrms';
import { DataSource, IsNull, Not } from 'typeorm';

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

  // find all training nominee by training id (nominee type = nominee & preparation status = going nomination)
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
            trainingDetails: { id: trainingId, trainingPreparationStatus: Not(TrainingPreparationStatus.PENDING) },
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
            trainingDetails: { id: trainingId, trainingPreparationStatus: TrainingPreparationStatus.FOR_BATCHING },
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

  // create training nominee batching
  async createTrainingNomineeBatch(data: Array<CreateTrainingBatchDto>) {
    try {
      // transaction result
      return await this.datasource.transaction(async (entityManager) => {
        //map data
        await Promise.all(
          data.map(async (batchItems) => {
            //deconstruct batch items
            const { employees, batchNumber, trainingDate } = batchItems;

            return await Promise.all(
              employees.map(async (employeeItems) => {
                //deconstruct employee items
                const { nomineeId } = employeeItems;

                //transaction update
                return await this.crudService.transact<TrainingNominee>(entityManager).update({
                  updateBy: { id: nomineeId },
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
          const supervisorName = await this.hrmsEmployeesService.findEmployeesById(batchItems.trainingDistribution.supervisorId);
          const employeeName = await this.hrmsEmployeesService.findEmployeesById(batchItems.employeeId);

          const employees = await Promise.all(
            distinctBatch.map(async (employeeItems) => {
              return {
                nomineeId: employeeItems.id,
                employeeId: employeeItems.employeeId,
                name: employeeName.fullName,
                distributionId: batchItems.trainingDistribution.id,
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
            employees: employees,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // update training nominee batch
  async updateTrainingNomineeBatch(data: Array<UpdateTrainingBatchDto>) {
    try {
      // transaction result
      return await this.datasource.transaction(async (entityManager) => {
        //map data
        await Promise.all(
          data.map(async (batchItems) => {
            //deconstruct batch items
            const { employees, batchNumber, trainingDate } = batchItems;

            return await Promise.all(
              employees.map(async (employeeItems) => {
                //deconstruct employee items
                const { nomineeId } = employeeItems;

                //transaction update
                return await this.crudService.transact<TrainingNominee>(entityManager).update({
                  updateBy: { id: nomineeId },
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
}
