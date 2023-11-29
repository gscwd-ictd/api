import { Injectable, Next } from '@nestjs/common';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { Report, User } from '@gscwd-api/utils';

@Injectable()
export class ReportsService {
  constructor(private readonly employeesService: EmployeesService, private readonly dtrService: DailyTimeRecordService) {}

  async generateReportOnAttendance(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees();

    const employeeAttendance = await Promise.all(
      employees.map(async (employee) => {
        const companyId = await this.employeesService.getCompanyId(employee.value);
        const name = employee.label;

        const report = (await this.dtrService.rawQuery(`CALL sp_generate_report_on_attendance(?,?,?);`, [companyId, dateFrom, dateTo]))[0][0];
        return { companyId, name, ...report };
      })
    );
    return employeeAttendance;
  }

  async generateReportOnPersonalPassSlip(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees();

    const _employeePassSlips = [];

    const employeePassSlips = await Promise.all(
      employees.map(async (employee) => {
        const employeeId = employee.value;
        const name = employee.label;

        const report = (
          await this.dtrService.rawQuery(`CALL sp_generate_report_on_personal_business_pass_slip(?,?,?);`, [employee.value, dateFrom, dateTo])
        )[0][0];

        if (report.noOfTimes !== '0') _employeePassSlips.push({ employeeId, name, ...report });
      })
    );
    return _employeePassSlips;
  }

  async generateReportOnOfficialBusinessPassSlip(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees();

    const _employeePassSlips = [];

    const employeePassSlips = await Promise.all(
      employees.map(async (employee) => {
        const employeeId = employee.value;
        const name = employee.label;

        const report = (
          await this.dtrService.rawQuery(`CALL sp_generate_report_on_official_business_pass_slip(?,?,?);`, [employee.value, dateFrom, dateTo])
        )[0][0];

        if (report.noOfTimes !== '0') _employeePassSlips.push({ employeeId, name, ...report });
      })
    );
    return _employeePassSlips;
  }

  async generateReport(report: Report, dateFrom: Date, dateTo: Date, user: User) {
    let reportDetails: object;
    switch (report) {
      case decodeURI(Report.REPORT_ON_ATTENDANCE):
        reportDetails = await this.generateReportOnAttendance(dateFrom, dateTo);
        break;
      case decodeURI(Report.REPORT_ON_PERSONAL_BUSINESS):
        reportDetails = await this.generateReportOnPersonalPassSlip(dateFrom, dateTo);
        break;
      case decodeURI(Report.REPORT_ON_OFFICIAL_BUSINESS):
        reportDetails = await this.generateReportOnOfficialBusinessPassSlip(dateFrom, dateTo);
        break;
      default:
        break;
    }

    return {
      report: reportDetails,
      signatory: {
        preparedBy: { id: '', name: '', positionTitle: '' },
        reviewedBy: { id: '', name: '', positionTitle: '' },
        approvedBy: { id: '', name: '', positionTitle: '' },
      },
    };
  }
}
