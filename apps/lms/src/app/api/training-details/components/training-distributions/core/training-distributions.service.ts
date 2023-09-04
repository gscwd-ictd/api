import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingDistributionDto, TrainingDistribution } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingDistributionsService extends CrudHelper<TrainingDistribution> {
  constructor(private readonly crudService: CrudService<TrainingDistribution>) {
    super(crudService);
  }

  //HR distribute slots to selected managers
  async addTrainingDistribution(data: CreateTrainingDistributionDto, entityManager: EntityManager) {
    //transaction results
    const results = await this.crudService.transact<TrainingDistribution>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return results;
  }
}
