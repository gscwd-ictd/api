import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  CreateTrainingExternalDto,
  CreateTrainingInternalDto,
  SendTrainingInternalDto,
  TrainingDetails,
  TrainingDistribution,
  TrainingLspDetails,
  TrainingRecommendedEmployee,
  TrainingTag,
  UpdateTrainingExternalDto,
  UpdateTrainingInternalDto,
} from '@gscwd-api/models';
import { DataSource, EntityManager, EntityNotFoundError, QueryFailedError } from 'typeorm';
import { TrainingTagsService } from '../components/training-tags';
import { TrainingDistributionsService } from '../components/training-distributions';
import { TrainingRecommendedEmployeeService } from '../components/training-recommended-employees';
import { LspDetailsService } from '../../lsp-details';
import { PortalEmployeesService } from '../../../services/portal';
import { TrainingLspDetailsService } from '../components/training-lsp-details';
import { RpcException } from '@nestjs/microservices';
import { TrainingPreparationStatus } from '@gscwd-api/utils';

@Injectable()
export class TrainingDetailsService extends CrudHelper<TrainingDetails> {
  constructor(
    private readonly crudService: CrudService<TrainingDetails>,
    private readonly trainingLspDetailsService: TrainingLspDetailsService,
    private readonly trainingTagsService: TrainingTagsService,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly trainingRecommendedEmployeesService: TrainingRecommendedEmployeeService,
    private readonly lspDetailsService: LspDetailsService,
    private readonly portalEmployeesService: PortalEmployeesService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  // training internal
  async addTrainingInternal(data: CreateTrainingInternalDto) {
    const { courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
          dto: {
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            ...rest,
          },
          onError: (error) => {
            throw error;
          },
        });
        //insert training lsp details
        await Promise.all(
          trainingLspDetails.map(async (trainingLspDetailsItem) => {
            return await this.trainingLspDetailsService.create(
              {
                trainingDetails,
                ...trainingLspDetailsItem,
              },
              entityManager
            );
          })
        );
        //insert training tags
        await Promise.all(
          trainingTags.map(async (trainingTagsItem) => {
            return await this.trainingTagsService.create(
              {
                trainingDetails,
                ...trainingTagsItem,
              },
              entityManager
            );
          })
        );
        //insert training slot distributions
        await Promise.all(
          slotDistribution.map(async (slotDistributionsItem) => {
            return await this.trainingDistributionsService.create(
              {
                trainingDetails,
                ...slotDistributionsItem,
              },
              entityManager
            );
          })
        );
        return data;
      });
      return result;
    } catch (error) {
      Logger.log(error);
      if (error.code === '23505' && error instanceof QueryFailedError) {
        // Duplicate key violation
        throw new HttpException('Duplicate Key Violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  // training external
  async addTrainingExternal(data: CreateTrainingExternalDto) {
    const { courseContent, trainingRequirements, bucketFiles, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
          dto: {
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            bucketFiles: JSON.stringify(bucketFiles),
            ...rest,
          },
          onError: (error) => {
            throw error;
          },
        });

        //insert training lsp details
        await Promise.all(
          trainingLspDetails.map(async (trainingLspDetailsItem) => {
            return await this.trainingLspDetailsService.create(
              {
                trainingDetails,
                ...trainingLspDetailsItem,
              },
              entityManager
            );
          })
        );

        //insert training tags
        await Promise.all(
          trainingTags.map(async (trainingTagsItem) => {
            return await this.trainingTagsService.create(
              {
                trainingDetails,
                ...trainingTagsItem,
              },
              entityManager
            );
          })
        );

        //insert training slot distributions
        await Promise.all(
          slotDistribution.map(async (slotDistributionsItem) => {
            return await this.trainingDistributionsService.create(
              {
                trainingDetails,
                ...slotDistributionsItem,
              },
              entityManager
            );
          })
        );

        return data;
      });

      return result;
    } catch (error) {
      Logger.log(error);
      if (error.code === '23505' && error instanceof QueryFailedError) {
        // Duplicate key violation
        throw new HttpException('Duplicate Key Violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async findTrainingById(id: string) {
    const trainingDetails = await this.crudService.findOne({
      find: { relations: { trainingDesign: true }, select: { trainingDesign: { id: true } }, where: { id: id } },
      onError: () => new NotFoundException(),
    });

    switch (true) {
      case trainingDetails.trainingDesign !== null:
        return await this.findTrainingInternalById(id);
      case trainingDetails.trainingDesign === null:
        return await this.findTrainingExternalById(id);
      default:
        return () => new NotFoundException();
    }
  }

  // get training details internal by id
  async findTrainingInternalById(id: string) {
    try {
      const trainingDetails = await this.crudService.findOne({
        find: {
          relations: { trainingDesign: true, trainingSource: true },
          select: {
            id: true,
            trainingDesign: { id: true, courseTitle: true },
            courseContent: true,
            location: true,
            trainingStart: true,
            trainingEnd: true,
            numberOfHours: true,
            deadlineForSubmission: true,
            numberOfParticipants: true,
            trainingRequirements: true,
            trainingSource: { id: true, name: true },
            trainingType: true,
            trainingPreparationStatus: true,
          },
          where: { id: id },
        },
        onError: () => new NotFoundException(),
      });

      const lspDetails = (await this.trainingLspDetailsService.crud().findAll({
        find: { relations: { lspDetails: true }, select: { lspDetails: { id: true } }, where: { trainingDetails: { id } } },
      })) as Array<TrainingLspDetails>;

      const trainingLspDetails = await Promise.all(
        lspDetails.map(async (lspDetailsItem) => {
          const lsp = await this.lspDetailsService.findLspDetailsById(lspDetailsItem.lspDetails.id);
          return {
            id: lspDetailsItem.lspDetails.id,
            name: lsp.name,
            email: lsp.email,
            type: lsp.type,
            lspSource: lsp.source,
          };
        })
      );

      const tag = (await this.trainingTagsService.crud().findAll({
        find: { relations: { tag: true }, select: { id: true, tag: { id: true, name: true } }, where: { trainingDetails: { id } } },
      })) as TrainingTag[];

      const trainingTags = await Promise.all(
        tag.map(async (tagItem) => {
          return {
            id: tagItem.tag.id,
            tag: tagItem.tag.name,
          };
        })
      );

      const distribution = (await this.trainingDistributionsService.crud().findAll({
        find: { select: { id: true, supervisorId: true, numberOfSlots: true }, where: { trainingDetails: { id } } },
      })) as TrainingDistribution[];

      const slotDistribution = await Promise.all(
        distribution.map(async (distributionItem) => {
          const employees = await this.trainingRecommendedEmployeesService
            .crud()
            .findAll({ find: { select: { employeeId: true }, where: { trainingDistribution: { id: distributionItem.id } } } });

          return {
            supervisor: {
              supervisorId: distributionItem.supervisorId,
            },
            numberOfSlots: distributionItem.numberOfSlots,
            employees,
          };
        })
      );

      return {
        id: trainingDetails.id,
        trainingDesign: trainingDetails.trainingDesign.id,
        courseTitle: trainingDetails.trainingDesign.courseTitle,
        courseContent: JSON.parse(trainingDetails.courseContent),
        location: trainingDetails.location,
        trainingStart: trainingDetails.trainingStart,
        trainingEnd: trainingDetails.trainingEnd,
        numberOfHours: trainingDetails.numberOfHours,
        deadlineForSubmission: trainingDetails.deadlineForSubmission,
        numberOfParticipants: trainingDetails.numberOfParticipants,
        trainingRequirements: JSON.parse(trainingDetails.trainingRequirements),
        trainingSource: trainingDetails.trainingSource.name,
        trainingType: trainingDetails.trainingType,
        preparationStatus: trainingDetails.trainingPreparationStatus,
        trainingLspDetails,
        trainingTags,
        slotDistribution,
      };
    } catch (error) {
      Logger.log(error);
      throw new NotFoundException();
    }
  }

  // get training details external by id
  async findTrainingExternalById(id: string) {
    try {
      const trainingDetails = await this.crudService.findOne({
        find: {
          relations: { trainingSource: true },
          select: {
            id: true,
            courseTitle: true,
            courseContent: true,
            location: true,
            trainingStart: true,
            trainingEnd: true,
            numberOfHours: true,
            deadlineForSubmission: true,
            numberOfParticipants: true,
            trainingRequirements: true,
            bucketFiles: true,
            trainingSource: { id: true, name: true },
            trainingType: true,
            trainingPreparationStatus: true,
          },
          where: { id: id },
        },
        onError: () => new NotFoundException(),
      });

      const lspDetails = (await this.trainingLspDetailsService.crud().findAll({
        find: { relations: { lspDetails: true }, select: { lspDetails: { id: true } }, where: { trainingDetails: { id } } },
      })) as Array<TrainingLspDetails>;

      const trainingLspDetails = await Promise.all(
        lspDetails.map(async (lspDetailsItem) => {
          const lsp = await this.lspDetailsService.findLspDetailsById(lspDetailsItem.lspDetails.id);
          return {
            id: lspDetailsItem.lspDetails.id,
            name: lsp.name,
            email: lsp.email,
            type: lsp.type,
            lspSource: lsp.source,
          };
        })
      );

      const tag = (await this.trainingTagsService.crud().findAll({
        find: { relations: { tag: true }, select: { id: true, tag: { id: true, name: true } }, where: { trainingDetails: { id } } },
      })) as TrainingTag[];

      const trainingTags = await Promise.all(
        tag.map(async (tagItem) => {
          return {
            id: tagItem.tag.id,
            tag: tagItem.tag.name,
          };
        })
      );

      const distribution = (await this.trainingDistributionsService.crud().findAll({
        find: { select: { id: true, supervisorId: true, numberOfSlots: true }, where: { trainingDetails: { id } } },
      })) as TrainingDistribution[];

      const slotDistribution = await Promise.all(
        distribution.map(async (distributionItem) => {
          const employees = await this.trainingRecommendedEmployeesService
            .crud()
            .findAll({ find: { select: { employeeId: true }, where: { trainingDistribution: { id: distributionItem.id } } } });

          return {
            supervisor: {
              supervisorId: distributionItem.supervisorId,
            },
            numberOfSlots: distributionItem.numberOfSlots,
            employees,
          };
        })
      );

      return {
        id: trainingDetails.id,
        courseTitle: trainingDetails.courseTitle,
        courseContent: JSON.parse(trainingDetails.courseContent),
        location: trainingDetails.location,
        trainingStart: trainingDetails.trainingStart,
        trainingEnd: trainingDetails.trainingEnd,
        numberOfHours: trainingDetails.numberOfHours,
        deadlineForSubmission: trainingDetails.deadlineForSubmission,
        numberOfParticipants: trainingDetails.numberOfParticipants,
        trainingRequirements: JSON.parse(trainingDetails.trainingRequirements),
        bucketFiles: JSON.parse(trainingDetails.bucketFiles),
        trainingSource: trainingDetails.trainingSource.name,
        trainingType: trainingDetails.trainingType,
        preparationStatus: trainingDetails.trainingPreparationStatus,
        trainingLspDetails,
        trainingTags,
        slotDistribution,
      };
    } catch (error) {
      Logger.log(error);
      throw new NotFoundException();
    }
  }

  // update traing internal by id
  async updateTrainingInternalById(data: UpdateTrainingInternalDto) {
    const { id, courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // remove all training components (training lsp details and training distribution)
        await this.removeTrainingComponents(id, false, entityManager);

        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).findOne({
          find: { where: { id } },
          onError: (error) => {
            throw error;
          },
        });

        // update training details and add training components
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: { id },
          dto: {
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            ...rest,
          },
          onError: (error) => {
            throw error;
          },
        });

        //insert training lsp details
        await Promise.all(
          trainingLspDetails.map(async (trainingLspDetailsItem) => {
            return await this.trainingLspDetailsService.create(
              {
                trainingDetails,
                ...trainingLspDetailsItem,
              },
              entityManager
            );
          })
        );

        //insert training tags
        await Promise.all(
          trainingTags.map(async (trainingTagsItem) => {
            return await this.trainingTagsService.create(
              {
                trainingDetails,
                ...trainingTagsItem,
              },
              entityManager
            );
          })
        );

        //insert training slot distributions
        await Promise.all(
          slotDistribution.map(async (slotDistributionsItem) => {
            return await this.trainingDistributionsService.create(
              {
                trainingDetails,
                ...slotDistributionsItem,
              },
              entityManager
            );
          })
        );

        return data;
      });

      return result;
    } catch (error) {
      Logger.log(error);
      if (error.code === '23505' && error instanceof QueryFailedError) {
        // Duplicate key violation
        throw new HttpException('Duplicate Key Violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503' && error instanceof QueryFailedError) {
        // Foreign key constraint violation
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else if (error instanceof EntityNotFoundError) {
        // Not found violation
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  // update training external by id
  async updateTrainingExternalById(data: UpdateTrainingExternalDto) {
    const { id, courseContent, trainingRequirements, bucketFiles, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // remove all training components (training lsp details and training distribution)
        await this.removeTrainingComponents(id, false, entityManager);

        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).findOne({
          find: { where: { id } },
          onError: (error) => {
            throw error;
          },
        });

        // update training details and add training components
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: { id },
          dto: {
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            bucketFiles: JSON.stringify(bucketFiles),
            ...rest,
          },
          onError: (error) => {
            throw error;
          },
        });

        //insert training lsp details
        await Promise.all(
          trainingLspDetails.map(async (trainingLspDetailsItem) => {
            return await this.trainingLspDetailsService.create(
              {
                trainingDetails,
                ...trainingLspDetailsItem,
              },
              entityManager
            );
          })
        );

        //insert training tags
        await Promise.all(
          trainingTags.map(async (trainingTagsItem) => {
            return await this.trainingTagsService.create(
              {
                trainingDetails,
                ...trainingTagsItem,
              },
              entityManager
            );
          })
        );

        //insert training slot distributions
        await Promise.all(
          slotDistribution.map(async (slotDistributionsItem) => {
            return await this.trainingDistributionsService.create(
              {
                trainingDetails,
                ...slotDistributionsItem,
              },
              entityManager
            );
          })
        );

        return data;
      });

      return result;
    } catch (error) {
      Logger.log(error);
      if (error.code === '23505' && error instanceof QueryFailedError) {
        // Duplicate key violation
        throw new HttpException('Duplicate Key Violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503' && error instanceof QueryFailedError) {
        // Foreign key constraint violation
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else if (error instanceof EntityNotFoundError) {
        // Not found violation
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  // send internal training notice to all distributed supervisor
  async sendTrainingInternal(data: SendTrainingInternalDto) {
    const { id, courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // remove all training components (training lsp details and training distribution)
        await this.removeTrainingComponents(id, false, entityManager);

        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).findOne({
          find: { where: { id } },
        });

        // update training details and add training components
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: { id },
          dto: {
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            trainingPreparationStatus: TrainingPreparationStatus.ON_GOING_NOMINATION,
            ...rest,
          },
          onError: (error) => {
            throw error;
          },
        });

        //insert training lsp details
        await Promise.all(
          trainingLspDetails.map(async (trainingLspDetailsItem) => {
            return await this.trainingLspDetailsService.create(
              {
                trainingDetails,
                ...trainingLspDetailsItem,
              },
              entityManager
            );
          })
        );

        //insert training tags
        await Promise.all(
          trainingTags.map(async (trainingTagsItem) => {
            return await this.trainingTagsService.create(
              {
                trainingDetails,
                ...trainingTagsItem,
              },
              entityManager
            );
          })
        );

        //insert training slot distributions
        await Promise.all(
          slotDistribution.map(async (slotDistributionsItem) => {
            return await this.trainingDistributionsService.create(
              {
                trainingDetails,
                ...slotDistributionsItem,
              },
              entityManager
            );
          })
        );
        return data;
      });
      return result;
    } catch (error) {
      Logger.log(error);
      if (error.code === '23505' && error instanceof QueryFailedError) {
        // Duplicate key violation
        throw new HttpException('Duplicate Key Violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  // remove training details
  async removeTrainingById(id: string) {
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // delete lsp components by lsp id
        await this.removeTrainingComponents(id, true, entityManager);

        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).delete({
          softDelete: true,
          deleteBy: { id },
        });
        return trainingDetails;
      });
      return result;
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // remove all training components (training tags)
  async removeTrainingComponents(id: string, softDelete: boolean, entityManager: EntityManager) {
    try {
      const trainingLspDetails = await this.trainingLspDetailsService.remove(id, softDelete, entityManager);
      const trainingTags = await this.trainingTagsService.remove(id, softDelete, entityManager);
      const trainingDistribution = await this.trainingDistributionsService.remove(id, softDelete, entityManager);
      return await Promise.all([trainingLspDetails, trainingTags, trainingDistribution]);
    } catch (error) {
      Logger.log(error);
      throw new Error(error);
    }
  }

  // microservices

  // find recommended employees by supervisor id (microservices)
  async findTrainingRecommendedEmployeeBySupervisorId(supervisorId: string) {
    try {
      const distribution = (await this.trainingDistributionsService.crud().findAll({
        find: {
          relations: { trainingDetails: true },
          select: {
            id: true,
            supervisorId: true,
            numberOfSlots: true,
            trainingDetails: {
              id: true,
              trainingPreparationStatus: true,
            },
          },
          where: { supervisorId, trainingDetails: { trainingPreparationStatus: TrainingPreparationStatus.ON_GOING_NOMINATION } },
        },
      })) as Array<TrainingDistribution>;

      const trainingDetails = await Promise.all(
        distribution.map(async (distributionItem) => {
          const { id, trainingDetails } = distributionItem;
          const training = await this.crudService.findOne({
            find: {
              relations: { trainingDesign: true },
              select: {
                id: true,
                courseTitle: true,
                trainingDesign: { id: true, courseTitle: true },
                location: true,
                trainingStart: true,
                trainingEnd: true,
                trainingPreparationStatus: true,
              },
              where: { id: trainingDetails.id },
            },
          });

          const employees = (await this.trainingRecommendedEmployeesService.crud().findAll({
            find: {
              select: { employeeId: true },
              where: { trainingDistribution: { id: distributionItem.id } },
            },
          })) as Array<TrainingRecommendedEmployee>;

          const recommended = await Promise.all(
            employees.map(async (items) => {
              const name = await this.portalEmployeesService.findEmployeesDetailsById(items.employeeId);
              return {
                employeeId: items.employeeId,
                name: name.fullName,
              };
            })
          );
          return {
            id: id,
            courseTitle: training.courseTitle || training.trainingDesign.courseTitle,
            location: training.location,
            trainingStart: training.trainingStart,
            trainingEnd: training.trainingEnd,
            preparationStatus: training.trainingPreparationStatus,
            numberOfSlots: distributionItem.numberOfSlots,
            recommended,
          };
        })
      );
      return trainingDetails;
    } catch (error) {
      Logger.log(error);
      throw new RpcException(error);
    }
  }
}
