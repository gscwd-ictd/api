import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspEducationDto, LspEducation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspEducationsService extends CrudHelper<LspEducation> {
  constructor(private readonly crudService: CrudService<LspEducation>) {
    super(crudService);
  }

  /* find all education by learning service provider id */
  async findAllEducationByLspId(lspDetailsId: string) {
    try {
      return await this.crudService.findAll({
        find: {
          select: {
            degree: true,
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

  /* insert learning service provider education */
  async createEducations(data: CreateLspEducationDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspEducation>(entityManager).create({
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

  /* remove education by learning service provider id */
  async deleteEducationsByLspId(lspDetailsId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspEducation>(entityManager).delete({
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
