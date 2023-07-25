import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingLspIndividualDto, TrainingLspIndividual } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingLspIndividualService extends CrudHelper<TrainingLspIndividual> {
  constructor(private readonly crudService: CrudService<TrainingLspIndividual>) {
    super(crudService);
  }

  async addTrainingLspIndividual(data: CreateTrainingLspIndividualDto, entityManager: EntityManager) {
    //transaction results
    const results = await this.crudService.transact<TrainingLspIndividual>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { trainingDetails, ...rest } = results;
    return rest;
  }
}
