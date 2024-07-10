import { CrudHelper, CrudService } from '@gscwd-api/crud';
import {
  CreateAdditionalNomineeDto,
  CreateNomineeDto,
  CreateStandInNomineeDto,
  RequirementsDto,
  TrainingBatchDto,
  TrainingNominee,
  UpdateTrainingNomineeStatusDto,
} from '@gscwd-api/models';
import { NomineeType, TrainingNomineeRaw, TrainingNomineeStatus, TrainingStatus } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HrmsEmployeesService } from '../../../../../services/hrms';
import { EntityManager, IsNull, MoreThanOrEqual, Not } from 'typeorm';
import { TrainingRequirementsService } from '../../requirements';

@Injectable()
export class TrainingNomineesService extends CrudHelper<TrainingNominee> {
  constructor(
    private readonly crudService: CrudService<TrainingNominee>,
    private readonly hrmsEmployeesService: HrmsEmployeesService,
    private readonly trainingRequirementsService: TrainingRequirementsService
  ) {
    super(crudService);
  }

  /* find all standin nominee by distribution id */
  async findStandInNomineeByDistributionId(distributionId: string) {
    try {
      const slot = await this.crudService
        .getRepository()
        .createQueryBuilder('tn')
        .select('td.no_of_slots', 'slots')
        .addSelect(
          `(td.no_of_slots - count(case when tn.status in ('accepted', 'pending') and tn.nominee_type = 'nominee' then 1 end))`,
          'availableSlots'
        )
        .innerJoin('training_distributions', 'td', 'tn.training_distribution_id_fk = td.training_distribution_id')
        .where('td.training_distribution_id = :distributionId', { distributionId: distributionId })
        .groupBy('td.no_of_slots')
        .getRawOne();

      const nominees = (await this.crudService.findAll({
        find: {
          relations: {
            trainingDistribution: true,
          },
          select: {
            id: true,
            employeeId: true,
          },
          where: {
            nomineeType: NomineeType.STAND_IN,
            trainingDistribution: {
              id: distributionId,
            },
          },
        },
      })) as Array<TrainingNominee>;

      const standin = await Promise.all(
        nominees.map(async (items) => {
          /* find employee name by employee id */
          const employeeName = (await this.hrmsEmployeesService.findEmployeesById(items.employeeId)).fullName;

          return {
            nomineeId: items.id,
            employeeId: items.employeeId,
            name: employeeName,
          };
        })
      );

      return {
        slots: slot.slots,
        availableSlots: parseInt(slot.availableSlots),
        standin: standin,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* create standin nominee */
  async createStandinNominee(data: CreateStandInNomineeDto) {
    try {
      const { nomineeId, standinId } = data;

      const nominee = await this.crudService.update({
        updateBy: {
          id: nomineeId,
        },
        dto: {
          isReplacedBy: standinId,
        },
        onError: () => {
          throw new HttpException('Error on updating nominee.', HttpStatus.BAD_REQUEST);
        },
      });

      if (nominee.affected > 0) {
        return await this.crudService.update({
          updateBy: {
            id: standinId,
          },
          dto: {
            nomineeType: NomineeType.NOMINEE,
            status: TrainingNomineeStatus.ACCEPTED,
            isProxyBy: nomineeId,
          },
        });
      } else {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      Logger.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* microservices for employees portal */

  /* create nominee */
  async createNominee(data: CreateNomineeDto, entityManager: EntityManager) {
    try {
      const { trainingDistribution, employeeId, nomineeType } = data;
      return await this.crudService.transact<TrainingNominee>(entityManager).create({
        dto: {
          trainingDistribution: {
            id: trainingDistribution,
          },
          employeeId: employeeId,
          nomineeType: nomineeType,
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

  /* find all training nominee by distribution id (nominee type = nominee or stand-in) */
  async findAllNomineesByDistributionId(data: TrainingNomineeRaw) {
    try {
      const { trainingId, supervisorId, nomineeType } = data;
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
              supervisorId: supervisorId,
              trainingDetails: {
                id: trainingId,
                status: MoreThanOrEqual(TrainingStatus.PENDING),
              },
            },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingNominee>;

      const result = await Promise.all(
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

      result.sort((a, b) => (a.name > b.name ? 1 : -1));

      return result;
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
            isReplacedBy: true,
            isProxyBy: true,
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
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingNominee>;

      const nominees = await Promise.all(
        distribution.map(async (items) => {
          /* find employee name by employee id */
          const employeeName = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(items.employeeId);

          /* find supervisor name by employee id */
          const supervisorName = await this.hrmsEmployeesService.findEmployeesById(items.trainingDistribution.supervisorId);

          const remarks = items.isProxyBy !== null ? 'Replaced ' + (await this.findNomineeDetailsByNomineeId(items.isProxyBy)).name : items.remarks;

          return {
            nomineeId: items.id,
            employeeId: items.employeeId,
            companyId: employeeName.companyId,
            name: employeeName.employeeFullName,
            status: items.status,
            remarks: remarks,
            isReplacedBy: items.isReplacedBy !== null ? true : false,
            assignment: employeeName.assignment.name,
            supervisor: {
              distributionId: items.trainingDistribution.id,
              supervisorId: items.trainingDistribution.supervisorId,
              name: supervisorName.fullName,
            },
          };
        })
      );

      return nominees.sort((a, b) => (a.name > b.name ? 1 : -1));
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

  /* find all nominees in all batches by training id */
  async findAllNomineeInBatchesByTrainingId(trainingId: string) {
    /* find all nominees */
    const nominees = (await this.crudService.findAll({
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
          nomineeType: NomineeType.NOMINEE,
          status: TrainingNomineeStatus.ACCEPTED,
          batchNumber: IsNull(),
          trainingDistribution: {
            trainingDetails: {
              id: trainingId,
              status: TrainingStatus.FOR_BATCHING,
            },
          },
        },
      },
      onError: (error) => {
        throw error;
      },
    })) as Array<TrainingNominee>;

    return await Promise.all(
      nominees.map(async (items) => {
        /* find supervisor name by employee id */
        const supervisorName = (await this.hrmsEmployeesService.findEmployeesById(items.trainingDistribution.supervisorId)).fullName;

        /* find nominee name by employee id */
        const employeeName = (await this.hrmsEmployeesService.findEmployeesById(items.employeeId)).fullName;

        return {
          nomineeId: items.id,
          employeeId: items.employeeId,
          name: employeeName,
          status: items.status,
          remarks: items.remarks,
          supervisor: {
            supervisorId: items.trainingDistribution.supervisorId,
            name: supervisorName,
          },
        };
      })
    );
  }

  /* insert a batch training */
  async createTrainingBatch(data: Array<TrainingBatchDto>, requirements: RequirementsDto, entityManager: EntityManager) {
    try {
      return await Promise.all(
        data.map(async (items) => {
          /* deconstruct items */
          const { employees, batchNumber, trainingDate } = items;

          /* insert a batch of nominees */
          return await Promise.all(
            employees.map(async (items) => {
              /* deconstruct items */
              const { nomineeId } = items;

              /* insert nominee requirements */
              await this.trainingRequirementsService.createNomineeRequirements(nomineeId, requirements, entityManager);

              /* set a batch of nominees */
              return await this.crudService.transact<TrainingNominee>(entityManager).update({
                updateBy: {
                  id: nomineeId,
                },
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
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  /* find all batches by training id */
  async findAllBatchByTrainingId(trainingId: string) {
    try {
      /* find all batch in a training */
      let batch = (await this.crudService.findAll({
        find: {
          select: {
            batchNumber: true,
            trainingStart: true,
            trainingEnd: true,
          },
          order: {
            batchNumber: 'ASC',
          },
          where: {
            batchNumber: Not(IsNull()),
            trainingDistribution: {
              trainingDetails: {
                id: trainingId,
              },
            },
          },
        },
      })) as Array<TrainingNominee>;

      /* distinct batch training */
      batch = await Promise.all(batch.filter((value, index, self) => index === self.findIndex((t) => t.batchNumber === value.batchNumber)));

      return await Promise.all(
        batch.map(async (items) => {
          /* find all employees by batch number */
          const batchEmployees = (await this.crudService.findAll({
            find: {
              relations: {
                trainingDistribution: true,
              },
              select: {
                id: true,
                employeeId: true,
                trainingDistribution: {
                  supervisorId: true,
                },
              },
              where: {
                batchNumber: items.batchNumber,
                trainingDistribution: {
                  trainingDetails: {
                    id: trainingId,
                  },
                },
              },
            },
            onError: (error) => {
              throw error;
            },
          })) as Array<TrainingNominee>;

          const employees = await Promise.all(
            batchEmployees.map(async (items) => {
              /* find employee name by employee id */
              const employeeName = (await this.hrmsEmployeesService.findEmployeesById(items.employeeId)).fullName;

              /* find supervisor name by employee id */
              const supervisorName = (await this.hrmsEmployeesService.findEmployeesById(items.trainingDistribution.supervisorId)).fullName;

              /* custom return */
              return {
                nomineeId: items.id,
                employeeId: items.employeeId,
                name: employeeName,
                distributionId: items.trainingDistribution.id,
                supervisor: {
                  supervisorId: items.trainingDistribution.supervisorId,
                  name: supervisorName,
                },
              };
            })
          );

          /* custom return */
          return {
            batchNumber: items.batchNumber,
            trainingDate: {
              from: items.trainingStart,
              to: items.trainingEnd,
            },
            employees: employees,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* find all nominees requirements by training id */
  async findAllNomineesRequirementsByTrainingId(trainingId: string) {
    try {
      /* find all batch in a training */
      let batch = (await this.crudService.findAll({
        find: {
          select: {
            batchNumber: true,
            trainingStart: true,
            trainingEnd: true,
          },
          order: {
            batchNumber: 'ASC',
          },
          where: {
            batchNumber: Not(IsNull()),
            trainingDistribution: {
              trainingDetails: {
                id: trainingId,
              },
            },
          },
        },
      })) as Array<TrainingNominee>;

      /* distinct batch training */
      batch = await Promise.all(batch.filter((value, index, self) => index === self.findIndex((t) => t.batchNumber === value.batchNumber)));

      return await Promise.all(
        batch.map(async (items) => {
          /* find all employees by batch number */
          const batchEmployees = (await this.crudService.findAll({
            find: {
              select: {
                id: true,
                employeeId: true,
              },
              where: {
                batchNumber: items.batchNumber,
                trainingDistribution: {
                  trainingDetails: {
                    id: trainingId,
                  },
                },
              },
            },
            onError: (error) => {
              throw error;
            },
          })) as Array<TrainingNominee>;

          const employees = await Promise.all(
            batchEmployees.map(async (items) => {
              /* find employee name by employee id */
              const employeeName = (await this.hrmsEmployeesService.findEmployeesById(items.employeeId)).fullName;

              const requirements = await this.trainingRequirementsService.findNomineeRequirementsByNomineeId(items.id);
              /* custom return */
              return {
                nomineeId: items.id,
                employeeId: items.employeeId,
                name: employeeName,
                requirements: requirements,
              };
            })
          );

          /* custom return */
          return {
            batchNumber: items.batchNumber,
            trainingDate: {
              from: items.trainingStart,
              to: items.trainingEnd,
            },
            employees: employees,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* find nominee details by nominee id */
  async findNomineeDetailsByNomineeId(nomineeId: string) {
    try {
      const nominee = await this.crudService.findOneBy({
        findBy: {
          id: nomineeId,
        },
      });

      const name = (await this.hrmsEmployeesService.findEmployeesById(nominee.employeeId)).fullName;

      return {
        nomineeId: nominee.id,
        employeeId: nominee.employeeId,
        name: name,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* create additional nominee */
  async createAdditionalNominee(data: CreateAdditionalNomineeDto, entityManager: EntityManager) {
    try {
      const { trainingDistributionId, employeeId } = data;

      const nominee = await this.crudService.transact<TrainingNominee>(entityManager).create({
        dto: {
          trainingDistribution: {
            id: trainingDistributionId,
          },
          employeeId: employeeId,
          nomineeType: NomineeType.NOMINEE,
          status: TrainingNomineeStatus.ACCEPTED,
          remarks: 'Additional Trainee',
        },
        onError: () => {
          throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        },
      });

      return {
        nomineeId: nominee.id,
        employeeId: nominee.employeeId,
        status: nominee.status,
      };
    } catch (error) {
      Logger.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
