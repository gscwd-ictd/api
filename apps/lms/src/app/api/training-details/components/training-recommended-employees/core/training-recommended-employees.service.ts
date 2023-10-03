import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingRecommendedEmployeeDto, TrainingRecommendedEmployee } from '@gscwd-api/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingRecommendedEmployeeService extends CrudHelper<TrainingRecommendedEmployee> {
  constructor(private readonly crudService: CrudService<TrainingRecommendedEmployee>) {
    super(crudService);
  }

  async create(data: CreateTrainingRecommendedEmployeeDto, entityManager: EntityManager) {
    //transaction results
    const results = await this.crudService.transact<TrainingRecommendedEmployee>(entityManager).create({
      dto: data,
      onError: () => new BadRequestException(),
    });
    return results;
  }
}
