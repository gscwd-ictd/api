import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspAffiliationDto, LspAffiliation } from '@gscwd-api/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspAffiliationsService extends CrudHelper<LspAffiliation> {
  constructor(private readonly crudService: CrudService<LspAffiliation>) {
    super(crudService);
  }

  //insert learning service provider affiliations
  async create(data: CreateLspAffiliationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspAffiliation>(entityManager).create({
      dto: data,
      onError: () => new BadRequestException(),
    });

    //deconstruct and return result
    const { lspDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider affiliations by lsp details id
  async delete(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspAffiliation>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
    //return result
    return result;
  }
}
