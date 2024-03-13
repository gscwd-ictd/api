import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspTrainingDto, LspTraining } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspTrainingsService extends CrudHelper<LspTraining> {
  constructor(private readonly crudService: CrudService<LspTraining>) {
    super(crudService);
  }

  /* find all trainings by learning service provider id */
  async findAllTrainingsByLspId(lspDetailsId: string) {
    try {
      return await this.crudService.findAll({
        find: {
          select: {
            name: true,
          },
          where: {
            lspDetails: { id: lspDetailsId },
          },
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* insert learning service provider training */
  async createTrainings(data: CreateLspTrainingDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspTraining>(entityManager).create({
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

  /* remove training by learning service provider id */
  async deleteTrainingsByLspId(lspDetailsId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspTraining>(entityManager).delete({
        deleteBy: {
          lspDetails: { id: lspDetailsId },
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
