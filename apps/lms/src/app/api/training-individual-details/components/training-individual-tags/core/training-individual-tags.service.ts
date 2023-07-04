import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingIndividualTagDto, TrainingIndividualTag } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingIndividualTagsService extends CrudHelper<TrainingIndividualTag> {
  constructor(private readonly crudService: CrudService<TrainingIndividualTag>) {
    super(crudService);
  }

  //HR insert training tag
  async addTrainingTag(data: CreateTrainingIndividualTagDto, entityManager: EntityManager) {
    //transaction results
    const results = await this.crudService.transact<TrainingIndividualTag>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { trainingIndividualDetails, ...rest } = results;
    return rest;
  }
}
