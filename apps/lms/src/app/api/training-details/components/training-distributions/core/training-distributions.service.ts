import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingDistributionDto, TrainingDistribution } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TrainingRecommendedEmployeeService } from '../../training-recommended-employees';

@Injectable()
export class TrainingDistributionsService extends CrudHelper<TrainingDistribution> {
  constructor(
    private readonly crudService: CrudService<TrainingDistribution>,
    private readonly trainingRecommendedEmployeesService: TrainingRecommendedEmployeeService
  ) {
    super(crudService);
  }

  //HR distribute slots to selected managers
  async create(data: CreateTrainingDistributionDto, entityManager: EntityManager) {
    const { employees, supervisor, ...rest } = data;

    const trainingDistribution = await this.crudService.transact<TrainingDistribution>(entityManager).create({
      dto: {
        supervisorId: supervisor.supervisorId,
        ...rest,
      },
      onError: (error) => {
        throw error;
      },
    });

    //insert training recommended employees
    await Promise.all(
      employees.map(async (recommendedEmployeeItem) => {
        return await this.trainingRecommendedEmployeesService.create(
          {
            trainingDistribution,
            ...recommendedEmployeeItem,
          },
          entityManager
        );
      })
    );

    return trainingDistribution;
  }

  async remove(trainingId: string, entityManager: EntityManager) {
    const trainingDistribution = await this.crudService.transact<TrainingDistribution>(entityManager).delete({
      deleteBy: {
        trainingDetails: { id: trainingId },
      },
      onError: (error) => {
        throw error;
      },
    });
    const trainingRecommendedEmployee = await this.trainingRecommendedEmployeesService.remove(trainingId, entityManager);
    return await Promise.all([trainingDistribution, trainingRecommendedEmployee]);
  }
}
