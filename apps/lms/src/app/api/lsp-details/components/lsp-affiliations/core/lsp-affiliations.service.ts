import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspAffiliationDto, LspAffiliation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspAffiliationsService extends CrudHelper<LspAffiliation> {
  constructor(private readonly crudService: CrudService<LspAffiliation>) {
    super(crudService);
  }

  //insert learning service provider affiliations
  async addAffiliations(dto: CreateLspAffiliationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspAffiliation>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider affiliations
  async deleteAffiliations(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspAffiliation>(entityManager).delete({
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
