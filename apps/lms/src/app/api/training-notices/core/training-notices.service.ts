import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityNotFoundError, QueryFailedError } from 'typeorm';
import { TrainingDetailsService } from '../../training-details';
import { TrainingDetails, TrainingNoticeExternalDto, TrainingNoticeInternalDto } from '@gscwd-api/models';
import { TrainingPreparationStatus } from '@gscwd-api/utils';
import { TrainingLspDetailsService } from '../../training-details/components/training-lsp-details';
import { TrainingTagsService } from '../../training-details/components/training-tags';
import { TrainingDistributionsService } from '../../training-details/components/training-distributions';

@Injectable()
export class TrainingNoticesService {
  constructor(
    private readonly datasource: DataSource,
    private readonly trainingDetailsService: TrainingDetailsService,
    private readonly trainingLspDetailsService: TrainingLspDetailsService,
    private readonly trainingTagsService: TrainingTagsService,
    private readonly trainingDistributionsService: TrainingDistributionsService
  ) {}

  // send internal training notice to all distributed supervisor
  async sendTrainingInternal(data: TrainingNoticeInternalDto) {
    const { id, courseContent, trainingRequirements, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // remove all training components (training lsp details and training distribution)
        await this.trainingDetailsService.removeTrainingComponents(id, false, entityManager);

        const trainingDetails = await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .findOneBy({
            findBy: { id, trainingPreparationStatus: TrainingPreparationStatus.PENDING },
            onError: (error) => {
              throw error;
            },
          });

        // update training details and add training components
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
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

  // send external training notice to all distributed supervisor
  async sendTrainingExternal(data: TrainingNoticeExternalDto) {
    const { id, courseContent, trainingRequirements, bucketFiles, trainingLspDetails, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // remove all training components (training lsp details and training distribution)
        await this.trainingDetailsService.removeTrainingComponents(id, false, entityManager);

        const trainingDetails = await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .findOneBy({
            findBy: { id, trainingPreparationStatus: TrainingPreparationStatus.PENDING },
            onError: (error) => {
              throw error;
            },
          });

        // update training details and add training components
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
            updateBy: { id },
            dto: {
              courseContent: JSON.stringify(courseContent),
              trainingRequirements: JSON.stringify(trainingRequirements),
              trainingPreparationStatus: TrainingPreparationStatus.ON_GOING_NOMINATION,
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
}
