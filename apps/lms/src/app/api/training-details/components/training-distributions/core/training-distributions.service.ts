import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingDistributionDto, TrainingDistribution } from '@gscwd-api/models';
import { BadRequestException, Injectable } from '@nestjs/common';
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
      onError: () => new BadRequestException(),
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
}
