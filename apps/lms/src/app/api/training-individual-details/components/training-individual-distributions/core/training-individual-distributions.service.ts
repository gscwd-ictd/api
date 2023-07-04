import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingIndividualDistributionDto, TrainingIndividualDistribution } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingIndividualDistributionsService extends CrudHelper<TrainingIndividualDistribution> {
  constructor(private readonly crudService: CrudService<TrainingIndividualDistribution>) {
    super(crudService);
  }

  //HR distribute slots to selected managers
  async addTrainingDistribution(data: CreateTrainingIndividualDistributionDto, entityManager: EntityManager) {
    //transaction results
    const results = await this.crudService.transact<TrainingIndividualDistribution>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { trainingIndividualDetails, ...rest } = results;
    return rest;
  }
}
