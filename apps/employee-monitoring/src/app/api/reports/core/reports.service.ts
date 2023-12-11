import { ForbiddenException, Injectable, Next } from '@nestjs/common';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { Report, User } from '@gscwd-api/utils';

@Injectable()
export class ReportsService {
  constructor(private readonly employeesService: EmployeesService, private readonly dtrService: DailyTimeRecordService) {}

  async generateReportOnAttendance(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

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
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

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
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

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

  async generateReportOnPersonalPassSlipDetailed(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

    const _employeePassSlips = [];

    const employeePassSlips = await Promise.all(
      employees.map(async (employee) => {
        const employeeId = employee.value;
        const name = employee.label;

        const report = (
          await this.dtrService.rawQuery(`CALL sp_generate_report_on_personal_business_pass_slip_detailed(?,?,?,?);`, [
            employeeId,
            name,
            dateFrom,
            dateTo,
          ])
        )[0];

        await Promise.all(
          report.map(async (reportItem) => {
            _employeePassSlips.push(reportItem);
          })
        );
      })
    );
    return _employeePassSlips;
  }

  async generateReportOnOfficialBusinessPassSlipDetailed(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

    const _employeePassSlips = [];

    const employeePassSlips = await Promise.all(
      employees.map(async (employee) => {
        const employeeId = employee.value;
        const name = employee.label;

        const report = (
          await this.dtrService.rawQuery(`CALL sp_generate_report_on_official_business_pass_slip_detailed(?,?,?,?);`, [
            employeeId,
            name,
            dateFrom,
            dateTo,
          ])
        )[0];

        await Promise.all(
          report.map(async (reportItem) => {
            _employeePassSlips.push(reportItem);
          })
        );
      })
    );
    return _employeePassSlips;
  }

  async generateReportOnEmployeeForcedLeaveCredits(monthYear: string) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

    const vlFlBalance = await Promise.all(
      employees.map(async (employee) => {
        const { value, label } = employee;
        const employeeDetails = await this.employeesService.getEmployeeDetails(value);
        const { companyId } = employeeDetails;
        const leaveDetails = (await this.dtrService.rawQuery(`CALL sp_generate_leave_ledger_view(?,?);`, [value, companyId]))[0];
        const { forcedLeaveBalance, vacationLeaveBalance } = leaveDetails[leaveDetails.length - 1];
        return { companyId, name: label, forcedLeaveBalance, vacationLeaveBalance };
      })
    );

    return vlFlBalance;
  }

  async generateReportOnEmployeeLeaveCreditBalance(monthYear: string) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

    const leaveCreditBalance = await Promise.all(
      employees.map(async (employee) => {
        const { value, label } = employee;
        const employeeDetails = await this.employeesService.getEmployeeDetails(value);
        const { companyId } = employeeDetails;
        const leaveDetails = (await this.dtrService.rawQuery(`CALL sp_generate_leave_ledger_view(?,?);`, [value, companyId]))[0];
        const { sickLeaveBalance, vacationLeaveBalance, forcedLeaveBalance } = leaveDetails[leaveDetails.length - 1];

        const totalVacationLeave = parseFloat(vacationLeaveBalance) + parseFloat(forcedLeaveBalance);

        return {
          companyId,
          name: label,
          sickLeaveBalance,
          vacationLeaveBalance: totalVacationLeave,
        };
      })
    );
    return leaveCreditBalance;
  }

  async generateReport(user: User, report: Report, dateFrom?: Date, dateTo?: Date, monthYear?: string) {
    if (user === null) throw new ForbiddenException();
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
      case decodeURI(Report.REPORT_ON_PERSONAL_BUSINESS_DETAILED):
        reportDetails = await this.generateReportOnPersonalPassSlipDetailed(dateFrom, dateTo);
        break;
      case decodeURI(Report.REPORT_ON_OFFICIAL_BUSINESS_DETAILED):
        reportDetails = await this.generateReportOnOfficialBusinessPassSlipDetailed(dateFrom, dateTo);
        break;
      case decodeURI(Report.REPORT_ON_EMPLOYEE_FORCED_LEAVE_CREDITS):
        if (monthYear) reportDetails = await this.generateReportOnEmployeeForcedLeaveCredits(monthYear);
        break;
      case decodeURI(Report.REPORT_ON_EMPLOYEE_LEAVE_CREDIT_BALANCE):
        if (monthYear) reportDetails = await this.generateReportOnEmployeeLeaveCreditBalance(monthYear);
        break;
      default:
        break;
    }

    const employeeDetails = await this.employeesService.getEmployeeDetails(user.employeeId);
    const supervisorId = await this.employeesService.getEmployeeSupervisorId(user.employeeId);
    const supervisorDetails = await this.employeesService.getEmployeeDetails(supervisorId.toString());
    const managerId = await this.employeesService.getEmployeeSupervisorId(supervisorId.toString());
    const managerDetails = await this.employeesService.getEmployeeDetails(managerId.toString());
    console.log('the user', user);
    return {
      report: reportDetails,
      signatory: {
        preparedBy: { name: employeeDetails.employeeFullName, positionTitle: employeeDetails.assignment.positionTitle },
        reviewedBy: { name: supervisorDetails.employeeFullName, positionTitle: supervisorDetails.assignment.positionTitle },
        approvedBy: { name: managerDetails.employeeFullName, positionTitle: managerDetails.assignment.positionTitle },
      },
    };
  }
}
