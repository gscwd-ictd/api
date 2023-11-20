import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingRecommendedEmployeeDto, TrainingRecommendedEmployee } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { PortalEmployeesService } from '../../../../../services/portal/portal-employees';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingRecommendedEmployeeService extends CrudHelper<TrainingRecommendedEmployee> {
  constructor(
    private readonly crudService: CrudService<TrainingRecommendedEmployee>,
    private readonly portalEmployeesService: PortalEmployeesService
  ) {
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

  async findAllByDistributionId(distributionId: string) {
    const recommended = (await this.crudService.findAll({
      find: { select: { employeeId: true }, where: { trainingDistribution: { id: distributionId } } },
    })) as Array<TrainingRecommendedEmployee>;

    return await Promise.all(
      recommended.map(async (recommendedItem) => {
        const employeeName = await this.portalEmployeesService.findEmployeesDetailsById(recommendedItem.employeeId);

        return {
          id: recommendedItem.employeeId,
          name: employeeName.fullName,
        };
      })
    );
  }

  async remove(trainingId: string, softDelete: boolean, entityManager: EntityManager) {
    return await this.crudService.transact<TrainingRecommendedEmployee>(entityManager).delete({
      deleteBy: { trainingDistribution: { id: trainingId } },
      softDelete: softDelete,
      onError: (error) => {
        throw error;
      },
    });
  }
}
