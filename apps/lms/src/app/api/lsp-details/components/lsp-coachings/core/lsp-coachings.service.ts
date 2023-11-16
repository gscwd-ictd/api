import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspCoachingDto, LspCoaching } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspCoachingsService extends CrudHelper<LspCoaching> {
  constructor(private readonly crudService: CrudService<LspCoaching>) {
    super(crudService);
  }

  // insert learning service provider coaching
  async create(data: CreateLspCoachingDto, entityManager: EntityManager) {
    return await this.crudService.transact<LspCoaching>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });
  }

  // remove learning service provider coaching by lsp details id
  async remove(lspDetailsId: string, softDelete: boolean, entityManager: EntityManager) {
    return await this.crudService.transact<LspCoaching>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: softDelete,
      onError: (error) => {
        throw error;
      },
    });
  }
}
