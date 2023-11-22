import { Injectable } from '@nestjs/common';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { EmployeesService } from '../../employees/core/employees.service';

@Injectable()
export class ReportsService {
  constructor(private readonly employeesService: EmployeesService, private readonly dtrService: DailyTimeRecordService) {}

  async generateReportOnAttendance(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees();

    const employeeAttendance = await Promise.all(
      employees.map(async (employee) => {
        //fetch dtr by employee id;
        const companyId = await this.employeesService.getCompanyId(employee.value);
        //const dtrDetails = await this.dtrService.getEmployeeDtrByMonthAndYear(companyId, 2023, 10);
        //return dtrDetails.summary;
        return (await this.dtrService.rawQuery(`CALL sp_generate_report_on_attendance(?,?,?);`, [companyId, dateFrom, dateTo]))[0];
      })
    );
    return employeeAttendance;
  }
}
