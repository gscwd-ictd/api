import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspTrainingDto, LspTraining } from '@gscwd-api/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspTrainingsService extends CrudHelper<LspTraining> {
  constructor(private readonly crudService: CrudService<LspTraining>) {
    super(crudService);
  }

  //insert learning service provider training
  async create(data: CreateLspTrainingDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspTraining>(entityManager).create({
      dto: data,
      onError: () => new BadRequestException(),
    });

    //deconstruct and return result
    const { lspDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider training by lsp details id
  async delete(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspTraining>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: () => new BadRequestException(),
    });

    //return result
    return result;
  }
}
