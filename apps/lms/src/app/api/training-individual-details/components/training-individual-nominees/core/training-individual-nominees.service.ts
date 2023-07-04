import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingIndividualNomineeDto, TrainingIndividualNominee } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TrainingIndividualNomineesService extends CrudHelper<TrainingIndividualNominee> {
  constructor(private readonly crudService: CrudService<TrainingIndividualNominee>, private readonly datasource: DataSource) {
    super(crudService);
  }

  //insert training nominees
  async addTrainingNominees(data: CreateTrainingIndividualNomineeDto) {
    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        const { employee, ...rest } = data;
        return await Promise.all(
          employee.map(async (employeeItem) => {
            return await this.crudService.transact<TrainingIndividualNominee>(entityManager).create({
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
