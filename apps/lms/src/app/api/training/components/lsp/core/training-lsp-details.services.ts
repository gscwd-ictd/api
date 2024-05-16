import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingLspDetailsDto, TrainingLspDetails } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LspDetailsService } from '../../../../lsp-details';
import { LspRatingService } from '../../../../lsp-rating';

@Injectable()
export class TrainingLspDetailsService extends CrudHelper<TrainingLspDetails> {
  constructor(
    private readonly crudService: CrudService<TrainingLspDetails>,
    private readonly lspDetailsService: LspDetailsService,
    private readonly lspRatingService: LspRatingService
  ) {
    super(crudService);
  }

  /* find all learning service provider by training id */
  async findAllLspDetailsByTrainingId(trainingId: string) {
    try {
      /* find all training learning service provider */
      const trainingLspDetails = (await this.crudService.findAll({
        find: {
          relations: { lspDetails: true },
          select: {
            id: true,
            lspDetails: {
              id: true,
            },
          },
          where: {
            trainingDetails: { id: trainingId },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingLspDetails>;

      /* custom return */
      return await Promise.all(
        trainingLspDetails.map(async (items) => {
          /* find learning service provider by learning service provider id */
          const lspDetails = await this.lspDetailsService.findLspDetailsById(items.lspDetails.id);

          /* custom return */
          return {
            id: lspDetails.id,
            name: lspDetails.name,
            email: lspDetails.email,
            type: lspDetails.type,
            source: lspDetails.source,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* insert training learning service provider details */
  async createLspDetails(data: CreateTrainingLspDetailsDto, entityManager: EntityManager) {
    try {
      const { id, ...rest } = data;

      /* insert the initial learning service provider rating */
      await this.lspRatingService.createLearningServiceProviderRating(
        {
          lspDetails: id,
          trainingDetails: data.trainingDetails,
        },
        entityManager
      );

      return await this.crudService.transact<TrainingLspDetails>(entityManager).create({
        dto: {
          ...rest,
          lspDetails: id,
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

  /* remove all training learning service provider by training id */
  async deleteAllLspDetailsByTrainingId(trainingId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<TrainingLspDetails>(entityManager).delete({
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
}
