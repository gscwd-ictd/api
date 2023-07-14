import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspOrganizationCertificationDto, LspOrganizationCertification } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspOrganizationCertificationsService extends CrudHelper<LspOrganizationCertification> {
  constructor(private readonly crudService: CrudService<LspOrganizationCertification>) {
    super(crudService);
  }

  //insert learning service provider organization certifications
  async addCertifications(dto: CreateLspOrganizationCertificationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationCertification>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspOrganizationDetails, ...rest } = result;
    return rest;
  }

  //insert learning service provider organization certifications
  async deleteCertifications(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationCertification>(entityManager).delete({
      deleteBy: { lspOrganizationDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    //return result
    return result;
  }
}
