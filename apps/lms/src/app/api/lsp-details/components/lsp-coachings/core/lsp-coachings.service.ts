import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspCoachingDto, LspCoaching } from '@gscwd-api/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspCoachingsService extends CrudHelper<LspCoaching> {
  constructor(private readonly crudService: CrudService<LspCoaching>) {
    super(crudService);
  }

  // insert learning service provider coaching
  async create(data: CreateLspCoachingDto, entityManager: EntityManager) {
    // transaction result
    const result = await this.crudService.transact<LspCoaching>(entityManager).create({
      dto: data,
      onError: () => new BadRequestException(),
    });

    // return result
    return result;
  }

  // delete learning service provider coaching by lsp details id
  async delete(lspDetailsId: string, entityManager: EntityManager) {
    // transaction result
    const result = await this.crudService.transact<LspCoaching>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: () => new BadRequestException(),
    });

    // return result
    return result;
  }
}
