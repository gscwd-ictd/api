import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingTagDto, TrainingTag } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingTagsService extends CrudHelper<TrainingTag> {
  constructor(private readonly crudService: CrudService<TrainingTag>) {
    super(crudService);
  }

  /* find all training tags by training id */
  async findAllTagsByTrainingId(trainingId: string) {
    try {
      /* find all training tags */
      const trainingTags = (await this.crudService.findAll({
        find: {
          relations: { tag: true },
          select: {
            id: true,
            tag: {
              id: true,
              name: true,
            },
          },
          where: {
            trainingDetails: { id: trainingId },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingTag>;

      /* custom return */
      return await Promise.all(
        trainingTags.map(async (items) => {
          /* custom return */
          return {
            id: items.tag.id,
            name: items.tag.name,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  /* insert training tag */
  async createTags(data: CreateTrainingTagDto, entityManager: EntityManager) {
    try {
      const { id, ...rest } = data;
      return await this.crudService.transact<TrainingTag>(entityManager).create({
        dto: {
          ...rest,
          tag: id,
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

  /* remove all training tags by training id */
  async deleteAllTagsByTrainingId(trainingId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<TrainingTag>(entityManager).delete({
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
