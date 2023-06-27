import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingNomineeDto, TrainingNominee } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TrainingNomineesService extends CrudHelper<TrainingNominee> {
  constructor(private readonly crudService: CrudService<TrainingNominee>, private readonly datasource: DataSource) {
    super(crudService);
  }

  //insert training nominees
  async addTrainingNominees(trainingNomineeDto: CreateTrainingNomineeDto) {
    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        const { employee, ...rest } = trainingNomineeDto;
        return await Promise.all(
          employee.map(async (employeeItem) => {
            return await this.crudService.transact<TrainingNominee>(entityManager).create({
              dto: { ...rest, employeeId: employeeItem },
              onError: ({ error }) => {
                return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
              },
            });
          })
        );
      });

      //return result
      return result;
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
    }
  }
}
