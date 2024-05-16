import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspRatingDto, LspRating, UpdateLspRatingDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspRatingService extends CrudHelper<LspRating> {
  constructor(private readonly crudService: CrudService<LspRating>) {
    super(crudService);
  }

  /* insert initial rating for the learning service provider */
  async createLearningServiceProviderRating(data: CreateLspRatingDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspRating>(entityManager).create({
        dto: data,
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* update rating for the learning service provider */
  async updateLearningServiceProviderRating(data: UpdateLspRatingDto) {
    try {
      const { id, ...rest } = data;
      const updateLspRating = await this.crudService.update({
        updateBy: {
          id: id,
        },
        dto: { ...rest },
        onError: () => {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        },
      });

      if (updateLspRating.affected < 1) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      return updateLspRating;
    } catch (error) {
      Logger.error(error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
