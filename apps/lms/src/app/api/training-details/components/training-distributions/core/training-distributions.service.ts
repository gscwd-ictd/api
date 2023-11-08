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

  async remove(trainingId: string, softDelete: boolean, entityManager: EntityManager) {
    // find all training distribution by traininng id
    const distribution = (await this.crudService.transact<TrainingDistribution>(entityManager).findAll({
      find: { select: { id: true }, where: { trainingDetails: { id: trainingId } } },
    })) as TrainingDistribution[];

    // delete all training recommended employee by distribution id
    await Promise.all(
      distribution.map(async (distributionItem) => {
        return await this.trainingRecommendedEmployeesService.remove(distributionItem.id, softDelete, entityManager);
      })
    );

    return await this.crudService.transact<TrainingDistribution>(entityManager).delete({
      deleteBy: {
        trainingDetails: { id: trainingId },
      },
      softDelete: softDelete,
      onError: (error) => {
        throw error;
      },
    });
  }
}
