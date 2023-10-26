import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspAwardDto, LspAward } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspAwardsService extends CrudHelper<LspAward> {
  constructor(private readonly crudService: CrudService<LspAward>) {
    super(crudService);
  }

  //insert learning service provider awards
  async create(data: CreateLspAwardDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspAward>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });

    // return result
    return result;
  }

  //delete learning service provider awards by lsp details id
  async delete(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspAward>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: (error) => {
        throw error;
      },
    });

    // return result
    return result;
  }
}
