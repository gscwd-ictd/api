import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingLspDetailsDto, TrainingLspDetails } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingLspDetailsService extends CrudHelper<TrainingLspDetails> {
  constructor(private readonly crudService: CrudService<TrainingLspDetails>) {
    super(crudService);
  }

  //insert training lsp details
  async create(data: CreateTrainingLspDetailsDto, entityManager: EntityManager) {
    const { id, ...rest } = data;
    //transaction results
    const results = await this.crudService.transact<TrainingLspDetails>(entityManager).create({
      dto: { lspDetails: id, ...rest },
      onError: (error) => {
        throw error;
      },
    });
    return results;
  }
}
