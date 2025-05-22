import { CrudHelper, CrudService } from '@gscwd-api/crud';
import {
  CreateTrainingBatchDto,
  CreateTrainingExternalDto,
  CreateTrainingInternalDto,
  GeneralManagerDto,
  PdcChairmanDto,
  PdcSecretariatDto,
  TrainingDetails,
  TrainingHistory,
  UpdateTrainingBatchDto,
  UpdateTrainingExternalDto,
  UpdateTrainingInternalDto,
  UpdateTrainingStatusDto,
} from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Raw } from 'typeorm';
import { TrainingTagsService } from '../components/tags';
import { TrainingLspDetailsService } from '../components/lsp';
import { TrainingDistributionsService } from '../components/slot-distributions';
import { DocumentRequirementsType, NomineeType, TrainingHistoryType, TrainingRequirementsRaw, TrainingStatus } from '@gscwd-api/utils';
import { TrainingApprovalsService } from '../components/approvals';
import { TrainingNomineesService } from '../components/nominees';
import { LspRatingService } from '../../lsp-rating';
import { HrmsEmployeeTagsService, HrmsEmployeesService } from '../../../services/hrms';
import { TrainingHistoryService } from '../../training-history';

@Injectable()
export class TrainingDetailsService extends CrudHelper<TrainingDetails> {
  constructor(
    private readonly crudService: CrudService<TrainingDetails>,
    private readonly trainingLspDetailsService: TrainingLspDetailsService,
    private readonly trainingTagsService: TrainingTagsService,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly trainingApprovalsService: TrainingApprovalsService,
    private readonly trainingNomineesService: TrainingNomineesService,
    private readonly lspRatingService: LspRatingService,
    private readonly hrmsEmployeesService: HrmsEmployeesService,
    private readonly hrmsEmployeeTagsService: HrmsEmployeeTagsService,
    private readonly trainingHistoryService: TrainingHistoryService,
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

      const actualNumberOfParticipants = await this.trainingNomineesService.countNomineeByTrainingId(id);

      const lspSource = trainingLspDetails.find((lsp) => lsp.source);

      /* find all training tag by training id */
      const trainingTags = await this.trainingTagsService.findAllTagsByTrainingId(id);

      /* find all slot distribution by training id */
      const slotDistribution = await this.trainingDistributionsService.findAllDistributionByTrainingId(id);

      /* find prepared name by employee id */
      const preparedBy = await this.hrmsEmployeesService.findEmployeeDetailsWithSignatureByEmployeeId(trainingDetails.preparedBy);

      /* custom return */
      return {
        createdAt: trainingDetails.createdAt,
        updatedAt: trainingDetails.updatedAt,
        deletedAt: trainingDetails.deletedAt,
        id: trainingDetails.id,
        trainingDesign: {
          id: trainingDetails.trainingDesign.id,
          courseTitle: trainingDetails.trainingDesign.courseTitle,
        },
        courseTitle: trainingDetails.trainingDesign.courseTitle,
        courseContent: JSON.parse(trainingDetails.courseContent),
        location: trainingDetails.location,
        trainingStart: trainingDetails.trainingStart,
        trainingEnd: trainingDetails.trainingEnd,
        numberOfHours: trainingDetails.numberOfHours,
        deadlineForSubmission: trainingDetails.deadlineForSubmission,
        numberOfParticipants: trainingDetails.numberOfParticipants,
        actualNumberOfParticipants: actualNumberOfParticipants,
        trainingRequirements: JSON.parse(trainingDetails.trainingRequirements),
        source: {
          id: trainingDetails.source.id,
          name: trainingDetails.source.name,
        },
        type: trainingDetails.type,
        status: trainingDetails.status,
        lspSource: lspSource.source,
        trainingLspDetails: trainingLspDetails,
        trainingTags: trainingTags,
        slotDistribution: slotDistribution,
        preparedBy: {
          employeeId: trainingDetails.preparedBy,
          name: preparedBy.employeeFullName,
          positionTitle: preparedBy.assignment.positionTitle,
          signature: preparedBy.signatureUrl,
        },
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

      const actualNumberOfParticipants = await this.trainingNomineesService.countNomineeByTrainingId(id);

      const lspSource = trainingLspDetails.find((lsp) => lsp.source);

      /* find all training tag by training id */
      const trainingTags = await this.trainingTagsService.findAllTagsByTrainingId(id);

      /* find all slot distribution by training id */
      const slotDistribution = await this.trainingDistributionsService.findAllDistributionByTrainingId(id);

      /* find prepared name by employee id */
      const preparedBy = await this.hrmsEmployeesService.findEmployeeDetailsWithSignatureByEmployeeId(trainingDetails.preparedBy);

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
        actualNumberOfParticipants: actualNumberOfParticipants,
        trainingRequirements: JSON.parse(trainingDetails.trainingRequirements),
        source: {
          id: trainingDetails.source.id,
          name: trainingDetails.source.name,
        },
        type: trainingDetails.type,
        status: trainingDetails.status,
        lspSource: lspSource.source,
        trainingLspDetails: trainingLspDetails,
        trainingTags: trainingTags,
        slotDistribution: slotDistribution,
        preparedBy: {
          employeeId: trainingDetails.preparedBy,
          name: preparedBy.employeeFullName,
          positionTitle: preparedBy.assignment.positionTitle,
          signature: preparedBy.signatureUrl,
        },
      };
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  /* insert training (source = internal) */
  async createTrainingInternal(data: CreateTrainingInternalDto, preparedBy: string) {
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
            preparedBy: preparedBy,
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

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: trainingDetails, trainingHistoryType: TrainingHistoryType.DRAFT_CREATE },
          entityManager
        );

        return trainingDetails;
      });
    } catch (error) {
      Logger.error(error);
      /* custom error */
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: { message: 'Duplicate key violation', step: 1 },
          },
          HttpStatus.CONFLICT,
          {
            cause: error,
          }
        );
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Foreign key constraint violation', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          }
        );
      } else {
        /* Handle other errors as needed */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Bad request', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          { cause: error }
        );
      }
    }
  }

  /* insert training (source = external) */
  async createTrainingExternal(data: CreateTrainingExternalDto, preparedBy: string) {
    try {
      return this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;

        /* insert training details */
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).create({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            preparedBy: preparedBy,
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

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: trainingDetails, trainingHistoryType: TrainingHistoryType.DRAFT_CREATE },
          entityManager
        );

        return trainingDetails;
      });
    } catch (error) {
      Logger.error(error);

      /* custom error */
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: { message: 'Duplicate key violation', step: 1 },
          },
          HttpStatus.CONFLICT,
          {
            cause: error,
          }
        );
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Foreign key constraint violation', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          }
        );
      } else {
        /* Handle other errors as needed */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Bad request', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          { cause: error }
        );
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
      /* custom error */
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: { message: 'Duplicate key violation', step: 1 },
          },
          HttpStatus.CONFLICT,
          {
            cause: error,
          }
        );
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Foreign key constraint violation', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          }
        );
      } else {
        /* Handle other errors as needed */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Bad request', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          { cause: error }
        );
      }
    }
  }

  /* edit training by id (source = external) */
  async updateTrainingExternalById(data: UpdateTrainingExternalDto) {
    try {
      return this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { id, courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;

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
      /* custom error */
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: { message: 'Duplicate key violation', step: 1 },
          },
          HttpStatus.CONFLICT,
          {
            cause: error,
          }
        );
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Foreign key constraint violation', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          }
        );
      } else {
        /* Handle other errors as needed */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Bad request', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          { cause: error }
        );
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

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: trainingDetails, trainingHistoryType: TrainingHistoryType.SUPERVISOR_NOMINATION },
          entityManager
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
        const { id, courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;

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

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: trainingDetails, trainingHistoryType: TrainingHistoryType.SUPERVISOR_NOMINATION },
          entityManager
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

  /* send approvals to the personnel development committee */
  async sendToPdc(id: string) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* validate training id */
        const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).findOneBy({
          findBy: {
            id: id,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* update training status to tdd manager approval */
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: {
            id: id,
          },
          dto: {
            status: TrainingStatus.TDD_MANAGER_APPROVAL,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: { id: id }, trainingHistoryType: TrainingHistoryType.TDD_MANAGER_REVIEW },
          entityManager
        );

        /* insert training approvals */
        return await this.trainingApprovalsService.createApproval({ trainingDetails }, entityManager);
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* insert a batch training */
  async createTrainingBatch(data: CreateTrainingBatchDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { trainingId, batches } = data;

        /* update training status  */
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: {
            id: trainingId,
          },
          dto: {
            status: TrainingStatus.DONE_BATCHING,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* insert list of requirements */
        const requirements = await this.createListOfRequirements(trainingId, entityManager);

        /* insert a batch training */
        await this.trainingNomineesService.createTrainingBatch(batches, requirements, entityManager);

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: { id: trainingId }, trainingHistoryType: TrainingHistoryType.PARTICIPANT_BATCHING },
          entityManager
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* edit a batch training */
  async updateTrainingBatch(data: UpdateTrainingBatchDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { trainingId, batches } = data;

        const requirements = await this.createListOfRequirements(trainingId, entityManager);
        /* insert a batch training */
        return await this.trainingNomineesService.createTrainingBatch(batches, requirements, entityManager);
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* edit training status */
  async updateTrainingStatus(data: UpdateTrainingStatusDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        const { trainingId, status } = data;

        if (status === TrainingStatus.COMPLETED) {
          /* set training to completed */
          const lspDetails = await this.trainingLspDetailsService.findAllLspDetailsByTrainingId(trainingId);

          await Promise.all(
            lspDetails.map(async (items) => {
              /* insert the initial learning service provider rating */
              await this.lspRatingService.createLearningServiceProviderRating(
                {
                  lspDetails: {
                    id: items.id,
                  },
                  trainingDetails: {
                    id: trainingId,
                  },
                },
                entityManager
              );
            })
          );

          /* insert training history */
          await this.trainingHistoryService.createTrainingHistory(
            { trainingDetails: { id: trainingId }, trainingHistoryType: TrainingHistoryType.TRAINING_COMPLETED },
            entityManager
          );

          return await this.crudService.transact<TrainingDetails>(entityManager).update({
            updateBy: {
              id: trainingId,
            },
            dto: {
              status: status,
            },
            onError: (error) => {
              throw error;
            },
          });
        } else if (status === TrainingStatus.ON_GOING_TRAINING) {
          /* insert training history */
          await this.trainingHistoryService.createTrainingHistory(
            { trainingDetails: { id: trainingId }, trainingHistoryType: TrainingHistoryType.TRAINING_ONGOING },
            entityManager
          );
          /* set training to on-going training */
          return await this.crudService.transact<TrainingDetails>(entityManager).update({
            updateBy: {
              id: trainingId,
            },
            dto: {
              status: status,
            },
            onError: (error) => {
              throw error;
            },
          });
        } else if (status === TrainingStatus.REQUIREMENTS_SUBMISSION) {
          /* insert training history */
          await this.trainingHistoryService.createTrainingHistory(
            { trainingDetails: { id: trainingId }, trainingHistoryType: TrainingHistoryType.REQUIREMENTS_SUBMISSION },
            entityManager
          );
          /* set training to on-going training */
          return await this.crudService.transact<TrainingDetails>(entityManager).update({
            updateBy: {
              id: trainingId,
            },
            dto: {
              status: status,
            },
            onError: (error) => {
              throw error;
            },
          });
        }

        return await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: {
            id: trainingId,
          },
          dto: {
            status: status,
          },
          onError: (error) => {
            throw error;
          },
        });
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* insert a list of requirements that nominees must submit */
  async createListOfRequirements(trainingId: string, entityManager: EntityManager) {
    try {
      /* find training requirements */
      const trainingDetails = await this.crudService.transact<TrainingDetails>(entityManager).findOne({
        find: {
          select: {
            trainingRequirements: true,
          },
          where: {
            id: trainingId,
          },
        },
        onError: (error) => {
          throw error;
        },
      });

      const requirements = JSON.parse(trainingDetails.trainingRequirements) as Array<TrainingRequirementsRaw>;
      const preTest = requirements.find((items) => items.document === DocumentRequirementsType.PRE_TEST) ? false : null;
      const courseMaterials = requirements.find((items) => items.document === DocumentRequirementsType.COURSE_MATERIALS) ? false : null;
      const postTrainingReport = requirements.find((items) => items.document === DocumentRequirementsType.POST_TRAINING_REPORT) ? false : null;
      const courseEvaluationReport = requirements.find((items) => items.document === DocumentRequirementsType.COURSE_EVALUATION_REPORT)
        ? false
        : null;
      const learningApplicationPlan = requirements.find((items) => items.document === DocumentRequirementsType.LEARNING_APPLICATION_PLAN)
        ? false
        : null;
      const postTest = requirements.find((items) => items.document === DocumentRequirementsType.POST_TEST) ? false : null;
      const certificateOfTraining = requirements.find((items) => items.document === DocumentRequirementsType.CERTIFICATE_OF_TRAINING) ? false : null;
      const certificateOfAppearance = requirements.find((items) => items.document === DocumentRequirementsType.CERTIFICATE_OF_APPEARANCE)
        ? false
        : null;
      const program = requirements.find((items) => items.document === DocumentRequirementsType.PROGRAM) ? false : null;

      return {
        preTest: preTest,
        courseMaterials: courseMaterials,
        postTrainingReport: postTrainingReport,
        courseEvaluationReport: courseEvaluationReport,
        learningApplicationPlan: learningApplicationPlan,
        postTest: postTest,
        certificateOfTraining: certificateOfTraining,
        certificateOfAppearance: certificateOfAppearance,
        program: program,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async findNomineesRequirementsByTrainingId(trainingId: string) {
    try {
      /* find training details */
      const trainingDetails = await this.crudService.findOne({
        find: {
          select: {
            id: true,
            trainingRequirements: true,
          },
          where: {
            id: trainingId,
          },
        },
        onError: (error) => {
          throw error;
        },
      });

      const requirements = await this.trainingRequirements(JSON.parse(trainingDetails.trainingRequirements));

      /* find nominees requirements  */
      const batches = await this.trainingNomineesService.findAllNomineesRequirementsByTrainingId(trainingId);

      /* custom return */
      return {
        requirements: requirements,
        batches: batches,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async trainingRequirements(requirements: Array<TrainingRequirementsRaw>) {
    try {
      const attendance = requirements.find((items) => items.document === DocumentRequirementsType.ATTENDANCE) ? true : null;
      const preTest = requirements.find((items) => items.document === DocumentRequirementsType.PRE_TEST) ? true : null;
      const courseMaterials = requirements.find((items) => items.document === DocumentRequirementsType.COURSE_MATERIALS) ? true : null;
      const postTrainingReport = requirements.find((items) => items.document === DocumentRequirementsType.POST_TRAINING_REPORT) ? true : null;
      const courseEvaluationReport = requirements.find((items) => items.document === DocumentRequirementsType.COURSE_EVALUATION_REPORT) ? true : null;
      const learningApplicationPlan = requirements.find((items) => items.document === DocumentRequirementsType.LEARNING_APPLICATION_PLAN)
        ? true
        : null;
      const postTest = requirements.find((items) => items.document === DocumentRequirementsType.POST_TEST) ? true : null;
      const certificateOfTraining = requirements.find((items) => items.document === DocumentRequirementsType.CERTIFICATE_OF_TRAINING) ? true : null;
      const certificateOfAppearance = requirements.find((items) => items.document === DocumentRequirementsType.CERTIFICATE_OF_APPEARANCE)
        ? true
        : null;
      const program = requirements.find((items) => items.document === DocumentRequirementsType.PROGRAM) ? true : null;

      return [
        {
          document: 'Attendance',
          isSelected: attendance,
        },
        {
          document: 'Pre-test',
          isSelected: preTest,
        },
        {
          document: 'Course Materials',
          isSelected: courseMaterials,
        },
        {
          document: 'Post Training Report',
          isSelected: postTrainingReport,
        },
        {
          document: 'Course Evaluation Report',
          isSelected: courseEvaluationReport,
        },
        {
          document: 'Learning Application Plan',
          isSelected: learningApplicationPlan,
        },
        {
          document: 'Post-test',
          isSelected: postTest,
        },
        {
          document: 'Certificate of Training',
          isSelected: certificateOfTraining,
        },
        {
          document: 'Certificate of Appearance',
          isSelected: certificateOfAppearance,
        },
        {
          document: 'Program',
          isSelected: program,
        },
      ];
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* count number of participants and available slot with list of supervisors */
  async findAllSupervisorsByTrainingId(trainingId: string) {
    try {
      const { numberOfParticipants, availableSlot } = await this.crudService
        .getRepository()
        .createQueryBuilder('tdd')
        .select('tdd.number_of_participants', 'numberOfParticipants')
        .addSelect(
          `tdd.number_of_participants - sum( case when tn.status in ('pending', 'accepted') and tn.nominee_type = 'nominee' then 1 end)`,
          'availableSlot'
        )
        .innerJoin('training_distributions', 'td', 'tdd.training_details_id = td.training_details_id_fk')
        .innerJoin('training_nominees', 'tn', 'td.training_distribution_id = tn.training_distribution_id_fk')
        .where('tdd.training_details_id = :trainingId', { trainingId: trainingId })
        .groupBy('tdd.number_of_participants')
        .addGroupBy('tdd.training_details_id')
        .getRawOne();

      const supervisors = await this.hrmsEmployeesService.findAllSupervisors();

      return {
        numberOfParticipants: numberOfParticipants,
        availableSlot: parseInt(availableSlot),
        supervisors,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*  find assignable employee under supervisor */
  async findAllAssignableEmployeeUnderSupervisor(trainingId: string, employeeId: string) {
    try {
      const trainingStatus = TrainingStatus.ON_GOING_NOMINATION;
      const nomineeType = NomineeType.NOMINEE;
      const nomineeStatus = null;

      const nomineesId = (await this.trainingNomineesService.findAllNomineeByTrainingId(trainingId, trainingStatus, nomineeType, nomineeStatus)).map(
        (items) => items.employeeId
      );

      const tags = (await this.findTrainingDetailsById(trainingId)).trainingTags.map((items) => items.id);

      const employees = await this.hrmsEmployeesService.findAllEmployeeUnderSupervisor(employeeId);

      const assignable = await Promise.all(
        employees
          .filter((items) => !nomineesId.includes(items.value))
          .map(async (items) => {
            const isTagged = await this.hrmsEmployeeTagsService.checkEmployeeTags(items.value, tags);
            return {
              value: {
                employeeId: items.value,
                name: items.label,
                isTagged: isTagged === '1' ? true : false,
              },
              label: items.label,
            };
          })
      );

      return assignable.sort((a, b) => {
        // First, compare based on isTagged property
        if (a.value.isTagged !== b.value.isTagged) {
          return a.value.isTagged ? -1 : 1; // 'true' comes before 'false'
        }
        // If both are tagged or untagged, then sort alphabetically by name
        return a.value.name.localeCompare(b.value.name);
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* count nominee by training id */
  async findAndCountNomineeByTrainingId(trainingId: string) {
    try {
      const count = await this.crudService
        .getRepository()
        .createQueryBuilder('tdd')
        .select(`count(case when tn.status = 'pending' and tn.nominee_type = 'nominee' then 1 end)`, 'pending')
        .addSelect(`count(case when tn.status = 'accepted' and tn.nominee_type = 'nominee' then 1 end)`, 'accepted')
        .addSelect(`count(case when tn.status = 'declined' and tn.nominee_type = 'nominee' then 1 end)`, 'declined')
        .addSelect(`count(case when tn.status = 'no action taken' and tn.nominee_type = 'nominee' then 1 end)`, 'no_action')
        .addSelect('tdd.number_of_participants', 'numberOfParticipants')
        .leftJoin('training_distributions', 'td', 'tdd.training_details_id = td.training_details_id_fk')
        .leftJoin('training_nominees', 'tn', 'td.training_distribution_id = tn.training_distribution_id_fk')
        .where('td.training_details_id_fk = :trainingId', { trainingId: trainingId })
        .groupBy('tdd.number_of_participants')
        .getRawOne();

      const trainingStatus = TrainingStatus.ON_GOING_NOMINATION;
      const nomineeType = NomineeType.NOMINEE;
      const nomineeStatus = null;
      const unassigned = parseInt(count.numberOfParticipants) - (parseInt(count.pending) + parseInt(count.accepted) + parseInt(count.no_action));

      const nominees = await this.trainingNomineesService.findAllNomineeByTrainingId(trainingId, trainingStatus, nomineeType, nomineeStatus);

      return {
        numberOfParticipants: count.numberOfParticipants,
        countStatus: {
          pending: parseInt(count.pending),
          accepted: parseInt(count.accepted),
          declined: parseInt(count.declined),
          noAction: parseInt(count.no_action),
          unassigned: unassigned,
        },
        nominees: nominees,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* tdd manager approval of training by training id */
  async tddManagerApproval(trainingId: string, employeeId: string) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* update training status */
        const training = await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: {
            id: trainingId,
          },
          dto: {
            status: TrainingStatus.PDC_SECRETARIAT_APPROVAL,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* update training approvals by training id */
        await this.trainingApprovalsService.tddManagerApproval(trainingId, employeeId, entityManager);

        /* update nominee status by training id */
        await this.trainingNomineesService.updateNomineeStatusNoActionTakenByTrainingId(trainingId, entityManager);

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          {
            trainingDetails: { id: trainingId },
            trainingHistoryType: TrainingHistoryType.TDD_MANAGER_APPROVED,
          },
          entityManager
        );

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: { id: trainingId }, trainingHistoryType: TrainingHistoryType.PDC_SECRETARIAT_REVIEW },
          entityManager
        );

        return training;
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* microservices */

  /* pdc secretariat approval of training by training id */
  async pdcSecretariatApproval(data: PdcSecretariatDto, trainingStatus: TrainingStatus) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        const { trainingDetails } = data;

        /* update training status */
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: {
            id: trainingDetails,
          },
          dto: {
            status: trainingStatus,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: { id: trainingDetails }, trainingHistoryType: TrainingHistoryType.PDC_SECRETARIAT_APPROVED },
          entityManager
        );

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: { id: trainingDetails }, trainingHistoryType: TrainingHistoryType.PDC_CHAIRMAN_REVIEW },
          entityManager
        );

        /* update training approvals by training id */
        return await this.trainingApprovalsService.pdcSecretariatApproval(data, entityManager);
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* pdc chairman approval of training by training id */
  async pdcChairmanApproval(data: PdcChairmanDto, trainingStatus: TrainingStatus) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        const { trainingDetails } = data;

        /* update training status */
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: {
            id: trainingDetails,
          },
          dto: {
            status: trainingStatus,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: { id: trainingDetails }, trainingHistoryType: TrainingHistoryType.PDC_CHAIRMAN_APPROVED },
          entityManager
        );

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: { id: trainingDetails }, trainingHistoryType: TrainingHistoryType.GENERAL_MANAGER_REVIEW },
          entityManager
        );

        /* update training approvals by training id */
        return await this.trainingApprovalsService.pdcChairmanApproval(data, entityManager);
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* general manager approval of training by training id */
  async generalManagerApproval(data: GeneralManagerDto, trainingStatus: TrainingStatus) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        const { trainingDetails } = data;

        /* update training status */
        await this.crudService.transact<TrainingDetails>(entityManager).update({
          updateBy: {
            id: trainingDetails,
          },
          dto: {
            status: trainingStatus,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* insert training history */
        await this.trainingHistoryService.createTrainingHistory(
          { trainingDetails: { id: trainingDetails }, trainingHistoryType: TrainingHistoryType.GENERAL_MANAGER_APPROVED },
          entityManager
        );

        /* update training approvals by training id */
        return await this.trainingApprovalsService.generalManagerApproval(data, entityManager);
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* count training approval by training status */
  async countTrainingApproval(trainingStatus: TrainingStatus) {
    try {
      const count = await this.crudService.getRepository().countBy({
        status: trainingStatus,
      });

      return {
        pendingApproval: count,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* custom find all trainings  */
  async customFindAllTrainings(dateRange: string) {
    try {
      const trainingDetails = (await this.crudService.findAll({
        find: {
          relations: {
            source: true,
            trainingDesign: true,
          },
          select: {
            id: true,
            source: {
              name: true,
            },
            trainingDesign: {
              courseTitle: true,
            },
            courseTitle: true,
            trainingStart: true,
            trainingEnd: true,
            type: true,
            trainingRequirements: true,
            numberOfParticipants: true,
            location: true,
            numberOfHours: true,
          },
          where: {
            trainingStart: Raw((alias) => `to_char(${alias}, 'YYYY-MM') = :dateRange`, { dateRange }),
            status: In([TrainingStatus.COMPLETED, TrainingStatus.REQUIREMENTS_SUBMISSION]),
          },
          order: {
            trainingStart: 'ASC',
          },
        },
      })) as Array<TrainingDetails>;

      const signatories = await this.hrmsEmployeesService.trainingSinatories(false);

      const training = await Promise.all(
        trainingDetails.map(async (items) => {
          const requirements = JSON.parse(items.trainingRequirements).map((req: TrainingRequirementsRaw) => {
            switch (req.document.toLowerCase()) {
              case 'attendance':
                return { ...req, code: 'ATT' };
              case 'post-test':
                return { ...req, code: 'PTR' };
              default:
                return { ...req, code: req.document };
            }
          });

          return {
            id: items.id,
            source: items.source.name,
            title: items.courseTitle || items.trainingDesign.courseTitle,
            location: items.location,
            trainingDate: {
              from: items.trainingStart,
              to: items.trainingEnd,
            },
            numberOfHours: items.numberOfHours,
            type: items.type,
            trainingRequirements: requirements,
            numberOfParticipants: items.numberOfParticipants,
          };
        })
      );

      const trainees = await Promise.all(
        training.map(async (items) => {
          const nominee = await this.trainingNomineesService.findAllNomineesRequirementsByTrainingId(items.id);

          const baseRequirements = items.trainingRequirements.map((req) => req.document);
          const participants: any[] = [];

          await Promise.all(
            nominee.map(async (batch) => {
              const qualifiedEmployees = await Promise.all(
                batch.employees
                  .filter((employee) =>
                    baseRequirements.every((reqName) => {
                      const match = employee.requirements.find((r) => r.document === reqName);
                      return match?.isSelected === true;
                    })
                  )
                  .map(async (items) => {
                    const employee = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(items.employeeId);
                    return {
                      companyId: employee.companyId,
                      employeeId: items.employeeId,
                      name: employee.employeeFullName,
                      assignment: employee.assignment.name,
                    };
                  })
              );

              participants.push(...qualifiedEmployees);
            })
          );

          return {
            title: items.title,
            participants,
          };
        })
      );

      return {
        training,
        trainees,
        signatories,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* find training history by training id */
  async findTrainingHistoryByTrainingId(trainingId: string) {
    try {
      const trainingHistory = (await this.trainingHistoryService.findTrainingHistoryByTrainingIdAndHistoryType(trainingId)) as Array<TrainingHistory>;

      return await Promise.all(
        trainingHistory.map(async (items) => {
          switch (items.trainingHistoryType) {
            case TrainingHistoryType.DRAFT_CREATE: {
              const trainingDetails = await this.findTrainingDetailsById(trainingId);
              return {
                date: items.createdAt,
                title: 'Training Drafted',
                description: 'Prepared by ' + trainingDetails.preparedBy.name,
                status: null,
              };
            }

            case TrainingHistoryType.SUPERVISOR_NOMINATION: {
              const trainingDetails = await this.findTrainingDetailsById(trainingId);

              const names = trainingDetails.slotDistribution.map((item) => item.supervisor.name).join(', ');
              return {
                date: items.createdAt,
                title: 'Sent to Supervisors',
                description: names,
                status: 'Ongoing nomination',
              };
            }

            case TrainingHistoryType.TDD_MANAGER_REVIEW: {
              return {
                date: items.createdAt,
                title: 'Training sent to Training & Development Division Manager',
                description: null,
                status: 'For review',
              };
            }

            case TrainingHistoryType.TDD_MANAGER_APPROVED: {
              const approval = await this.trainingApprovalsService.findTddManagerApprovalByTrainingId(trainingId);

              return {
                date: items.createdAt,
                title: 'Training reviewed by the Training & Development Division Manager',
                description: approval.tddManager.name,
                status: 'Approved',
              };
            }

            case TrainingHistoryType.PDC_SECRETARIAT_REVIEW: {
              return {
                date: items.createdAt,
                title: 'Training sent to Personnel Development Committee Secretariat',
                description: null,
                status: 'For review',
              };
            }

            case TrainingHistoryType.PDC_SECRETARIAT_APPROVED: {
              const approval = await this.trainingApprovalsService.findPdcSecretariatApprovalByTrainingId(trainingId);

              return {
                date: items.createdAt,
                title: 'Training reviewed by the Personnel Development Committee Secretariat',
                description: approval.pdcSecretariat.name,
                status: 'Approved',
              };
            }

            case TrainingHistoryType.PDC_CHAIRMAN_REVIEW: {
              return {
                date: items.createdAt,
                title: 'Training sent to Personnel Development Committee Chairman',
                description: null,
                status: 'For review',
              };
            }

            case TrainingHistoryType.PDC_CHAIRMAN_APPROVED: {
              const approval = await this.trainingApprovalsService.findPdcChairmanApprovalByTrainingId(trainingId);

              return {
                date: items.createdAt,
                title: 'Training reviewed by the Personnel Development Committee Chairman',
                description: approval.pdcChairman.name,
                status: 'Approved',
              };
            }

            case TrainingHistoryType.GENERAL_MANAGER_REVIEW: {
              return {
                date: items.createdAt,
                title: 'Training sent to General Manager',
                description: null,
                status: 'For approval',
              };
            }

            case TrainingHistoryType.GENERAL_MANAGER_APPROVED: {
              const approval = await this.trainingApprovalsService.findGeneralManagerApprovalByTrainingId(trainingId);

              return {
                date: items.createdAt,
                title: 'Training reviewed by the General Manager',
                description: approval.generalManager.name,
                status: 'Approved',
              };
            }

            case TrainingHistoryType.PARTICIPANT_BATCHING: {
              return {
                date: items.createdAt,
                title: 'Training Participants Batching',
                description: 'Training and Development Staff',
                status: null,
              };
            }

            case TrainingHistoryType.TRAINING_ONGOING: {
              return {
                date: items.createdAt,
                title: 'Training Start',
                description: null,
                status: null,
              };
            }

            case TrainingHistoryType.REQUIREMENTS_SUBMISSION: {
              return {
                date: items.createdAt,
                title: 'Training Participants submission of requirements',
                description: null,
                status: null,
              };
            }

            case TrainingHistoryType.TRAINING_COMPLETED: {
              return {
                date: items.createdAt,
                title: 'Training Completed',
                description: null,
                status: null,
              };
            }

            default:
              break;
          }
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }
  }
}
