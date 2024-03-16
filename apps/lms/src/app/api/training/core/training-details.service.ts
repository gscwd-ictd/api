import { CrudHelper, CrudService } from '@gscwd-api/crud';
import {
  CreateTrainingExternalDto,
  CreateTrainingInternalDto,
  TrainingDetails,
  UpdateTrainingExternalDto,
  UpdateTrainingInternalDto,
} from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { TrainingTagsService } from '../components/tags';
import { TrainingLspDetailsService } from '../components/lsp';
import { TrainingDistributionsService } from '../components/slot-distributions';
import { TrainingStatus } from '@gscwd-api/utils';

@Injectable()
export class TrainingDetailsService extends CrudHelper<TrainingDetails> {
  constructor(
    private readonly crudService: CrudService<TrainingDetails>,
    private readonly trainingLspDetailsService: TrainingLspDetailsService,
    private readonly trainingTagsService: TrainingTagsService,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  /* find training by id */
  async findTrainingDetailsById(id: string) {
    try {
      /* check if training id is existing */
      const trainingDetails = await this.crudService.findOneBy({
        findBy: { id: id },
        onError: () => {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        },
      });

      switch (true) {
        /* find training by id (source = internal) */
        case trainingDetails.courseTitle === null:
          return await this.findTrainingInternalById(id);

        /* find training by id (source = external) */
        case trainingDetails.courseTitle !== null:
          return await this.findTrainingExternalById(id);

        /* throw not found  */
        default:
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* find training by id (source = internal) */
  async findTrainingInternalById(id: string) {
    try {
      /* find training details by id */
      const trainingDetails = await this.crudService.findOne({
        find: {
          relations: {
            trainingDesign: true,
            source: true,
          },
          where: {
            id: id,
          },
        },
        onError: () => {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        },
      });

      /* find all training learning service provider by training id */
      const trainingLspDetails = await this.trainingLspDetailsService.findAllLspDetailsByTrainingId(id);

      /* find all training tag by training id */
      const trainingTags = await this.trainingTagsService.findAllTagsByTrainingId(id);

      /* find all slot distribution by training id */
      const slotDistribution = await this.trainingDistributionsService.findAllDistributionByTrainingId(id);

      /* custom return */
      return {
        createdAt: trainingDetails.createdAt,
        updatedAt: trainingDetails.updatedAt,
        deletedAt: trainingDetails.deletedAt,
        id: trainingDetails.id,
        trainingDesign: {
          id: trainingDetails.trainingDesign.id,
        },
        courseTitle: trainingDetails.trainingDesign.courseTitle,
        courseContent: JSON.parse(trainingDetails.courseContent),
        location: trainingDetails.location,
        trainingStart: trainingDetails.trainingStart,
        trainingEnd: trainingDetails.trainingEnd,
        numberOfHours: trainingDetails.numberOfHours,
        deadlineForSubmission: trainingDetails.deadlineForSubmission,
        numberOfParticipants: trainingDetails.numberOfParticipants,
        trainingRequirements: JSON.parse(trainingDetails.trainingRequirements),
        source: {
          id: trainingDetails.source.id,
          name: trainingDetails.source.name,
        },
        type: trainingDetails.type,
        status: trainingDetails.status,
        trainingLspDetails: trainingLspDetails,
        trainingTags: trainingTags,
        slotDistribution: slotDistribution,
      };
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  /* find training by id (source = external) */
  async findTrainingExternalById(id: string) {
    try {
      /* find training details by id */
      const trainingDetails = await this.crudService.findOne({
        find: {
          relations: {
            source: true,
          },
          where: {
            id: id,
          },
        },
        onError: () => {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        },
      });

      /* find all training learning service provider by training id */
      const trainingLspDetails = await this.trainingLspDetailsService.findAllLspDetailsByTrainingId(id);

      /* find all training tag by training id */
      const trainingTags = await this.trainingTagsService.findAllTagsByTrainingId(id);

      /* find all slot distribution by training id */
      const slotDistribution = await this.trainingDistributionsService.findAllDistributionByTrainingId(id);

      return {
        createdAt: trainingDetails.createdAt,
        updatedAt: trainingDetails.updatedAt,
        deletedAt: trainingDetails.deletedAt,
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
        source: {
          id: trainingDetails.source.id,
          name: trainingDetails.source.name,
        },
        type: trainingDetails.type,
        status: trainingDetails.status,
        trainingLspDetails: trainingLspDetails,
        trainingTags: trainingTags,
        slotDistribution: slotDistribution,
      };
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  /* insert training (source = internal) */
  async createTrainingInternal(data: CreateTrainingInternalDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;

        /* insert traing details */
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
          },
          onError: (error) => {
            throw error;
          },
        });

        /* insert training learning service provider */
        await Promise.all(
          trainingLspDetails.map(async (items) => {
            return await this.trainingLspDetailsService.createLspDetails({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training tags */
        await Promise.all(
          trainingTags.map(async (items) => {
            return await this.trainingTagsService.createTags({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training slot distributions */
        await Promise.all(
          slotDistribution.map(async (items) => {
            return await this.trainingDistributionsService.createSlotDistributions({ trainingDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /* Handle other errors as needed */
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* insert training (source = external) */
  async createTrainingExternal(data: CreateTrainingExternalDto) {
    try {
      return this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { courseContent, trainingRequirements, bucketFiles, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;

        /* insert training details */
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            bucketFiles: JSON.stringify(bucketFiles),
          },
          onError: (error) => {
            throw error;
          },
        });

        /* insert training learning service provider */
        await Promise.all(
          trainingLspDetails.map(async (items) => {
            return await this.trainingLspDetailsService.createLspDetails({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training tags */
        await Promise.all(
          trainingTags.map(async (items) => {
            return await this.trainingTagsService.createTags({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training slot distributions */
        await Promise.all(
          slotDistribution.map(async (items) => {
            return await this.trainingDistributionsService.createSlotDistributions({ trainingDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /* Handle other errors as needed */
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* edit training by id (source = internal) */
  async updateTrainingInternalById(data: UpdateTrainingInternalDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { id, courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;

        /* check training id */
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).findOneBy({
          findBy: { id: id },
          onError: (error) => {
            throw error;
          },
        });

        /* edit traing details */
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: { id: id },
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
          },
          onError: (error) => {
            throw error;
          },
        });

        /* remove training components */
        await this.deleteComponentsByTrainingId(id, entityManager);

        /* insert training learning service provider */
        await Promise.all(
          trainingLspDetails.map(async (items) => {
            return await this.trainingLspDetailsService.createLspDetails({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training tags */
        await Promise.all(
          trainingTags.map(async (items) => {
            return await this.trainingTagsService.createTags({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training slot distributions */
        await Promise.all(
          slotDistribution.map(async (items) => {
            return await this.trainingDistributionsService.createSlotDistributions({ trainingDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /* Handle other errors as needed */
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* edit training by id (source = external) */
  async updateTrainingExternalById(data: UpdateTrainingExternalDto) {
    try {
      return this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { id, courseContent, trainingRequirements, bucketFiles, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;

        /* check training id */
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).findOneBy({
          findBy: { id: id },
          onError: (error) => {
            throw error;
          },
        });

        /* edit training details */
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: { id: id },
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            bucketFiles: JSON.stringify(bucketFiles),
          },
          onError: (error) => {
            throw error;
          },
        });

        /* remove training components */
        await this.deleteComponentsByTrainingId(id, entityManager);

        /* insert training learning service provider */
        await Promise.all(
          trainingLspDetails.map(async (items) => {
            return await this.trainingLspDetailsService.createLspDetails({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training tags */
        await Promise.all(
          trainingTags.map(async (items) => {
            return await this.trainingTagsService.createTags({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training slot distributions */
        await Promise.all(
          slotDistribution.map(async (items) => {
            return await this.trainingDistributionsService.createSlotDistributions({ trainingDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /* Handle other errors as needed */
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* remove training components by id */
  async deleteComponentsByTrainingId(trainingId: string, entityManager: EntityManager) {
    try {
      const lspDetails = await this.trainingLspDetailsService.deleteAllLspDetailsByTrainingId(trainingId, entityManager);
      const tags = await this.trainingTagsService.deleteAllTagsByTrainingId(trainingId, entityManager);
      const slotDistributions = await this.trainingDistributionsService.deleteAllDistributionByTrainingId(trainingId, entityManager);

      return await Promise.all([lspDetails, tags, slotDistributions]);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  /* send a training notice to the manager to nominate (source = internal) */
  async sendNoticeToManagersInternal(data: UpdateTrainingInternalDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { id, courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;

        /* check training id */
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).findOneBy({
          findBy: { id: id },
          onError: (error) => {
            throw error;
          },
        });

        /* edit traing details */
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: { id: id },
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            status: TrainingStatus.ON_GOING_NOMINATION,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* remove training components */
        await this.deleteComponentsByTrainingId(id, entityManager);

        /* insert training learning service provider */
        await Promise.all(
          trainingLspDetails.map(async (items) => {
            return await this.trainingLspDetailsService.createLspDetails({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training tags */
        await Promise.all(
          trainingTags.map(async (items) => {
            return await this.trainingTagsService.createTags({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training slot distributions */
        await Promise.all(
          slotDistribution.map(async (items) => {
            return await this.trainingDistributionsService.createSlotDistributions({ trainingDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /* Handle other errors as needed */
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* send a training notice to the manager to nominate (source = external) */
  async sendNoticeToManagersExternal(data: UpdateTrainingExternalDto) {
    try {
      return this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { id, courseContent, trainingRequirements, bucketFiles, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;

        /* check training id */
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).findOneBy({
          findBy: { id: id },
          onError: (error) => {
            throw error;
          },
        });

        /* edit training details */
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: { id: id },
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            bucketFiles: JSON.stringify(bucketFiles),
            status: TrainingStatus.ON_GOING_NOMINATION,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* remove training components */
        await this.deleteComponentsByTrainingId(id, entityManager);

        /* insert training learning service provider */
        await Promise.all(
          trainingLspDetails.map(async (items) => {
            return await this.trainingLspDetailsService.createLspDetails({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training tags */
        await Promise.all(
          trainingTags.map(async (items) => {
            return await this.trainingTagsService.createTags({ trainingDetails, ...items }, entityManager);
          })
        );

        /* insert training slot distributions */
        await Promise.all(
          slotDistribution.map(async (items) => {
            return await this.trainingDistributionsService.createSlotDistributions({ trainingDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /* Handle other errors as needed */
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* send training notice to managers */
  async updateTrainingStatusById(id: string, status: TrainingStatus) {
    try {
      return await this.crudService.update({
        updateBy: {
          id: id,
        },
        dto: {
          status: status,
        },
        onError: () => {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        },
      });
    } catch (error) {
      Logger.error;
    }
  }

  async findAllTrainingRecommendedEmployeesBySupevisorId(supervisorId: string) {}
}
