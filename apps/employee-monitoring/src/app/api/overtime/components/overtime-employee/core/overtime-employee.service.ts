import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOvertimeEmployeeDto, OvertimeEmployee } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EmployeesService } from '../../../../employees/core/employees.service';

@Injectable()
export class OvertimeEmployeeService extends CrudHelper<OvertimeEmployee> {
  constructor(private readonly crudService: CrudService<OvertimeEmployee>, private readonly employeeService: EmployeesService) {
    super(crudService);
  }

  async createOvertimeEmployees(createOvertimeEmployeeDto: CreateOvertimeEmployeeDto, entityManager: EntityManager) {
    //get salary grade if casual/permanent...get daily rate if job order
    const { dailyRate, salaryGradeAmount } = await this.employeeService.getSalaryGradeOrDailyRateByEmployeeId(createOvertimeEmployeeDto.employeeId);

    return await this.crudService.transact<OvertimeEmployee>(entityManager).create({
      dto: { salaryGradeAmount, dailyRate, ...createOvertimeEmployeeDto },
      onError: () => new InternalServerErrorException(),
    });
  }
}
