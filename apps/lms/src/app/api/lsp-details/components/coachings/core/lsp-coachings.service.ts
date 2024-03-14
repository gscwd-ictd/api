import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspCoachingDto, LspCoaching } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspCoachingsService extends CrudHelper<LspCoaching> {
  constructor(private readonly crudService: CrudService<LspCoaching>) {
    super(crudService);
  }

  /* find all coaching by learning service provider id */
  async findAllCoachingByLspId(lspDetailsId: string) {
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

  /* insert learning service provider coaching */
  async createCoachings(data: CreateLspCoachingDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspCoaching>(entityManager).create({
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

  /* remove coaching by learning service provider id */
  async deleteCoachingsByLspId(lspDetailsId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspCoaching>(entityManager).delete({
        deleteBy: { lspDetails: { id: lspDetailsId } },
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
