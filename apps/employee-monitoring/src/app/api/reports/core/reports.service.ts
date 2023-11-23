import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../../employees/core/employees.service';

@Injectable()
export class ReportsService {
  constructor(private readonly employeesService: EmployeesService) {}

  async generateReportOnAttendance(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees();

    const employeeAttendance = await Promise.all(
      employees.map(async (employee) => {
        //fetch dtr by employee id;
      })
    );
    return employeeAttendance;
  }
}
