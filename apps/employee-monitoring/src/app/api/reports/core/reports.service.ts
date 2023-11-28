import { Injectable } from '@nestjs/common';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { Report } from '@gscwd-api/utils';

@Injectable()
export class ReportsService {
  constructor(private readonly employeesService: EmployeesService, private readonly dtrService: DailyTimeRecordService) {}

  async generateReportOnAttendance(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees();

    const employeeAttendance = await Promise.all(
      employees.map(async (employee) => {
        const companyId = await this.employeesService.getCompanyId(employee.value);
        const name = employee.label;

        const asd = [1,2,3];
        const report = (await this.dtrService.rawQuery(`CALL sp_generate_report_on_attendance(?,?,?);`, [companyId, dateFrom, dateTo]))[0][0];
        return { companyId, name, ...report };
      })
    );
    return employeeAttendance;
  }

  async generateReport(report: Report, dateFrom: Date, dateTo: Date) {
    switch (report) {
      case decodeURI(Report.REPORT_ON_ATTENDANCE):
        return await this.generateReportOnAttendance(dateFrom, dateTo);
    }
  }
}
