import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingRecommendedEmployeeDto, TrainingRecommendedEmployee } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HrmsEmployeesService } from '../../../../../services/hrms/employees';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingRecommendedEmployeeService extends CrudHelper<TrainingRecommendedEmployee> {
  constructor(private readonly crudService: CrudService<TrainingRecommendedEmployee>, private readonly hrmsEmployeesService: HrmsEmployeesService) {
    super(crudService);
  }

  /* find all recommeded employees by distribution id*/
  async findAllRecommendedEmployeesByDistributionId(distributionId: string) {
    try {
      /* find all recommended employees */
      const recommendedEmployees = (await this.crudService.findAll({
        find: {
          select: {
            employeeId: true,
          },
          where: {
            trainingDistribution: { id: distributionId },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingRecommendedEmployee>;

      /* custom return */
      return await Promise.all(
        recommendedEmployees.map(async (items) => {
          /* find employee name by employee id */
          const employeeName = await this.hrmsEmployeesService.findEmployeesById(items.employeeId);

          /* custom return */
          return {
            employeeId: items.employeeId,
            name: employeeName.fullName,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* insert recommended employees */
  async createRecommendedEmployees(data: CreateTrainingRecommendedEmployeeDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<TrainingRecommendedEmployee>(entityManager).create({
        dto: data,
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
