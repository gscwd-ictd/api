import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspCertificationDto, LspCertification } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspCertificationsService extends CrudHelper<LspCertification> {
  constructor(private readonly crudService: CrudService<LspCertification>) {
    super(crudService);
  }

  /* find all certifications by learning service provider id */
  async findAllCertificationsByLspId(lspDetailsId: string) {
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

  /* insert learning service provider certifications */
  async createCertifications(data: CreateLspCertificationDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspCertification>(entityManager).create({
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

  /* remove certifications by learning service provider id */
  async deleteCertificationsByLspId(lspDetailsId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspCertification>(entityManager).delete({
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
