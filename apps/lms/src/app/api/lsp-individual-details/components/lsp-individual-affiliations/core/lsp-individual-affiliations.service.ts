import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualAffiliationDto, LspIndividualAffiliation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspIndividualAffiliationsService extends CrudHelper<LspIndividualAffiliation> {
  constructor(private readonly crudService: CrudService<LspIndividualAffiliation>) {
    super(crudService);
  }

  //insert learning service provider affiliations
  async addAffiliations(dto: CreateLspIndividualAffiliationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualAffiliation>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspIndividualDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider affiliations
  async deleteAffiliations(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualAffiliation>(entityManager).delete({
      deleteBy: { lspIndividualDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    //return result
    return result;
  }
}
