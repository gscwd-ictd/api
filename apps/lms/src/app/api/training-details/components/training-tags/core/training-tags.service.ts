import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingTagDto, TrainingTag } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingTagsService extends CrudHelper<TrainingTag> {
  constructor(private readonly crudService: CrudService<TrainingTag>) {
    super(crudService);
  }

  //insert training tag
  async create(data: CreateTrainingTagDto, entityManager: EntityManager) {
    //transaction results
    const results = await this.crudService.transact<TrainingTag>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });

    return results;
  }
}
