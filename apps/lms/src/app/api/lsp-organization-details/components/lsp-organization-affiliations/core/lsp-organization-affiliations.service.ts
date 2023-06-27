import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspOrganizationAffiliationDto, LspOrganizationAffiliation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspOrganizationAffiliationsService extends CrudHelper<LspOrganizationAffiliation> {
  constructor(private readonly crudService: CrudService<LspOrganizationAffiliation>) {
    super(crudService);
  }

  //insert learning service provider affiliations
  async addAffiliations(dto: CreateLspOrganizationAffiliationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationAffiliation>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspOrganizationDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider affiliations
  async deleteAffiliations(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationAffiliation>(entityManager).delete({
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
