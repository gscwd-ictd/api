import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingRecommendedEmployeeDto, TrainingRecommendedEmployee } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingRecommendedEmployeeService extends CrudHelper<TrainingRecommendedEmployee> {
  constructor(private readonly crudService: CrudService<TrainingRecommendedEmployee>) {
    super(crudService);
  }

  async create(data: CreateTrainingRecommendedEmployeeDto, entityManager: EntityManager) {
    //transaction results
    return await this.crudService.transact<TrainingRecommendedEmployee>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });
  }

  async remove(trainingId: string, entityManager: EntityManager) {
    return await this.crudService.transact<TrainingRecommendedEmployee>(entityManager).delete({
      deleteBy: { trainingDistribution: { trainingDetails: { id: trainingId } } },
      onError: (error) => {
        throw error;
      },
    });
  }
}
