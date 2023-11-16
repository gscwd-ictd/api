import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspAffiliationDto, LspAffiliation } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspAffiliationsService extends CrudHelper<LspAffiliation> {
  constructor(private readonly crudService: CrudService<LspAffiliation>) {
    super(crudService);
  }

  // insert learning service provider affiliations
  async create(data: CreateLspAffiliationDto, entityManager: EntityManager) {
    return await this.crudService.transact<LspAffiliation>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });
  }

  // remove learning service provider affiliations by lsp details id
  async remove(lspDetailsId: string, softDelete: boolean, entityManager: EntityManager) {
    return await this.crudService.transact<LspAffiliation>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: softDelete,
      onError: (error) => {
        throw error;
      },
    });
  }
}
