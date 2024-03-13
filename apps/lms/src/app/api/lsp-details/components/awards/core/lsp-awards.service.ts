import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspAwardDto, LspAward } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspAwardsService extends CrudHelper<LspAward> {
  constructor(private readonly crudService: CrudService<LspAward>) {
    super(crudService);
  }

  /* find all awards by learning service provider id */
  async findAllAwardsByLspId(lspDetailsId: string) {
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

  /* insert learning service provider awards */
  async createAwards(data: CreateLspAwardDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspAward>(entityManager).create({
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

  /* remove awards by learning service provider id */
  async deleteAwardsByLspId(lspDetailsId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspAward>(entityManager).delete({
        deleteBy: {
          lspDetails: { id: lspDetailsId },
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
}
