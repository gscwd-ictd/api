import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingDistributionDto, TrainingDistribution, TrainingRecommendedEmployee } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TrainingRecommendedEmployeeService } from '../../training-recommended-employees';
import { PortalEmployeesService } from '../../../../../services/portal';

@Injectable()
export class TrainingDistributionsService extends CrudHelper<TrainingDistribution> {
  constructor(
    private readonly crudService: CrudService<TrainingDistribution>,
    private readonly trainingRecommendedEmployeesService: TrainingRecommendedEmployeeService,
    private readonly portalEmployeesService: PortalEmployeesService
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

  async findAllByTrainingId(trainingId: string) {
    try {
      const distribution = (await this.crudService.findAll({
        find: { select: { id: true, supervisorId: true, numberOfSlots: true }, where: { trainingDetails: { id: trainingId } } },
      })) as Array<TrainingDistribution>;

      return await Promise.all(
        distribution.map(async (distributionItem) => {
          const supervisorName = await this.portalEmployeesService.findEmployeesDetailsById(distributionItem.supervisorId);

          const recommend = await this.trainingRecommendedEmployeesService.findAllByDistributionId(distributionItem.id);

          return {
            supervisor: {
              supervisorId: distributionItem.supervisorId,
              supervisorName: supervisorName.fullName,
            },
            numberOfSlots: distributionItem.numberOfSlots,
            employees: recommend,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
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
