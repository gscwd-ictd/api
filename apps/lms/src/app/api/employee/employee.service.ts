import { EmployeeTrainingView } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class EmployeeService {
  constructor(private readonly dataSource: DataSource) {}

  async findTraininDetailsByEmployeeId(employeeId: string) {
    try {
      const repo = this.dataSource.getRepository(EmployeeTrainingView);

      const result = await repo.find({
        where: {
          employeeId: employeeId,
        },
      });

      return result;
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
