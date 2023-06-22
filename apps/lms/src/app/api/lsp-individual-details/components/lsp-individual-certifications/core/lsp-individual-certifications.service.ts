import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualCertificationDto, LspIndividualCertification } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspIndividualCertificationsService extends CrudHelper<LspIndividualCertification> {
  constructor(private readonly crudService: CrudService<LspIndividualCertification>) {
    super(crudService);
  }

  //insert learning service provider certifications
  async addCertifications(dto: CreateLspIndividualCertificationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualCertification>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspDetails, ...rest } = result;
    return rest;
  }

  //insert learning service provider certifications
  async deleteCertifications(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualCertification>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    //return result
    return result;
  }
}
