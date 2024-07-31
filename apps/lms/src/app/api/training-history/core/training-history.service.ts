import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingHistoryDto, TrainingHistory } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingHistoryService extends CrudHelper<TrainingHistory> {
  constructor(private readonly crudService: CrudService<TrainingHistory>) {
    super(crudService);
  }

  /* create training history */
  async createTrainingHistory(data: CreateTrainingHistoryDto, entityManager: EntityManager) {
    try {
      return this.crudService.transact<TrainingHistory>(entityManager).create({
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

  /* find training history by training id and history type */
  async findTrainingHistoryByTrainingIdAndHistoryType(trainingId: string) {
    try {
      return await this.crudService.findAll({
        find: {
          relations: {
            trainingDetails: true,
          },
          where: {
            trainingDetails: {
              id: trainingId,
            },
          },
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
