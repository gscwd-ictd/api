import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspTrainingDto, LspTraining } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspTrainingsService extends CrudHelper<LspTraining> {
  constructor(private readonly crudService: CrudService<LspTraining>) {
    super(crudService);
  }

  // insert learning service provider training
  async create(data: CreateLspTrainingDto, entityManager: EntityManager) {
    return await this.crudService.transact<LspTraining>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });
  }

  // remove learning service provider training by lsp details id
  async remove(lspDetailsId: string, softDelete: boolean, entityManager: EntityManager) {
    return await this.crudService.transact<LspTraining>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: softDelete,
      onError: (error) => {
        throw error;
      },
    });
  }
}
