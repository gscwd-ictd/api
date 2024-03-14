import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspAffiliationDto, LspAffiliation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspAffiliationsService extends CrudHelper<LspAffiliation> {
  constructor(private readonly crudService: CrudService<LspAffiliation>) {
    super(crudService);
  }

  /* find all affiliations by learning service provider id */
  async findAllAffiliationsByLspId(lspDetailsId: string) {
    try {
      return await this.crudService.findAll({
        find: {
          select: {
            position: true,
            institution: true,
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

  /* insert learning service provider affiliations */
  async createAffiliations(data: CreateLspAffiliationDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspAffiliation>(entityManager).create({
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

  /* remove affiliations by learning service provider id */
  async deleteAffiliationsByLspId(lspDetailsId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspAffiliation>(entityManager).delete({
        deleteBy: {
          lspDetails: { id: lspDetailsId },
        },
        softDelete: false,
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
