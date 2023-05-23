import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspCertificationDto, LspCertification } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspCertificationsService extends CrudHelper<LspCertification> {
  constructor(private readonly crudService: CrudService<LspCertification>) {
    super(crudService);
  }

  async addLspCertifications(lspCertificationDto: CreateLspCertificationDto, entityManager: EntityManager) {
    const lspCertification = await this.crudService.transact<LspCertification>(entityManager).create({
      dto: lspCertificationDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { lspDetails, ...rest } = lspCertification;
    return rest;
  }

  async deleteAllLspCertificationsByLspDetailsIdTransaction(lspDetailsId: string, entityManager: EntityManager) {
    const deleteResult = await this.crudService.transact<LspCertification>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return deleteResult;
  }
}
