import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingRecommendedEmployeeDto, TrainingRecommendedEmployee } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class TrainingRecommendedEmployeeService extends CrudHelper<TrainingRecommendedEmployee> {
  constructor(private readonly crudService: CrudService<TrainingRecommendedEmployee>, private readonly datasource: DataSource) {
    super(crudService);
  }

  async addTrainingRecommendedEmployee(data: CreateTrainingRecommendedEmployeeDto, entityManager: EntityManager) {
    //transaction results
    const results = await this.crudService.transact<TrainingRecommendedEmployee>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { trainingDistribution, ...rest } = results;
    return rest;
  }
}
