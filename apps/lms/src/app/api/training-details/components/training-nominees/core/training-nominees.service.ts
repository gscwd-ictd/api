import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingNomineeDto, TrainingNominee } from '@gscwd-api/models';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DataSource } from 'typeorm';

@Injectable()
export class TrainingNomineesService extends CrudHelper<TrainingNominee> {
  constructor(private readonly crudService: CrudService<TrainingNominee>, private readonly datasource: DataSource) {
    super(crudService);
  }

  //insert training nominees
  async create(data: CreateTrainingNomineeDto) {
    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        const { employee, ...rest } = data;
        return await Promise.all(
          employee.map(async (employeeItem) => {
            return await this.crudService.transact<TrainingNominee>(entityManager).create({
              dto: { ...rest, employeeId: employeeItem },
              onError: (error) => {
                throw error;
              },
            });
          })
        );
      });

      //return result
      return result;
    } catch (error) {
      Logger.log(error);
      throw new RpcException(error);
    }
  }
}
