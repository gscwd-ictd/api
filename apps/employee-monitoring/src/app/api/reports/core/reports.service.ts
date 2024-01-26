import { ForbiddenException, Injectable, Next } from '@nestjs/common';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { Report, User } from '@gscwd-api/utils';
import dayjs = require('dayjs');

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
        const leaveDetails = (
          await this.dtrService.rawQuery(`CALL sp_generate_leave_ledger_view_by_month_year(?,?,?);`, [value, companyId, monthYear])
        )[0];
        const { forcedLeaveBalance, vacationLeaveBalance } = leaveDetails[leaveDetails.length - 1];
        return {
          companyId,
          name: label,
          forcedLeaveBalance: parseFloat(forcedLeaveBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          vacationLeaveBalance: parseFloat(vacationLeaveBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        };
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
        const leaveDetails = (
          await this.dtrService.rawQuery(`CALL sp_generate_leave_ledger_view_by_month_year(?,?,?);`, [value, companyId, monthYear])
        )[0];
        const { sickLeaveBalance, vacationLeaveBalance, forcedLeaveBalance } = leaveDetails[leaveDetails.length - 1];

        const totalVacationLeave = parseFloat(
          (parseFloat(vacationLeaveBalance) + parseFloat(forcedLeaveBalance)).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );

        return {
          companyId,
          name: label,
          sickLeaveBalance: parseFloat(sickLeaveBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          vacationLeaveBalance: totalVacationLeave.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          totalLeaveBalance: (totalVacationLeave + parseFloat(sickLeaveBalance)).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        };
      })
    );
    return leaveCreditBalance;
  }

  async generateReportOnEmployeeLeaveCreditBalanceWithMoney(monthYear: string) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

    const leaveCreditBalance = await Promise.all(
      employees.map(async (employee) => {
        const { value, label } = employee;
        const employeeDetails = await this.employeesService.getEmployeeDetails(value);
        const { companyId } = employeeDetails;
        const leaveDetails = (
          await this.dtrService.rawQuery(`CALL sp_generate_leave_ledger_view_by_month_year(?,?,?);`, [value, companyId, monthYear])
        )[0];
        const { sickLeaveBalance, vacationLeaveBalance, forcedLeaveBalance } = leaveDetails[leaveDetails.length - 1];
        const monthlyRate = ((await this.employeesService.getMonthlyHourlyRateByEmployeeId(value)) as { monthlyRate: number }).monthlyRate;
        const totalVacationLeave = parseFloat(
          (parseFloat(vacationLeaveBalance) + parseFloat(forcedLeaveBalance)).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        );

        return {
          companyId,
          name: label,
          vacationLeaveBalance: totalVacationLeave.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          sickLeaveBalance: sickLeaveBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          totalLeaveBalance: (totalVacationLeave + parseFloat(sickLeaveBalance)).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          monthlyRate: monthlyRate.toLocaleString(),
          conversion: (parseFloat((monthlyRate * (totalVacationLeave + parseFloat(sickLeaveBalance))).toString()) * 0.0481927).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          ),
        };
      })
    );
    return leaveCreditBalance;
  }

  async generateReportOnSummaryOfLeaveWithoutPay(monthYear: string) {
    console.log(monthYear);

    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

    const _employeesLWOP = [];

    await Promise.all(
      employees.map(async (employee) => {
        const employeeDetails = await this.employeesService.getEmployeeDetails(employee.value);
        const { companyId } = employeeDetails;
        const employeeLWOP = (
          await this.dtrService.rawQuery(`CALL sp_generate_report_on_lwop_summary(?,?,?,?);`, [employee.value, employee.label, companyId, monthYear])
        )[0];
        if (employeeLWOP) {
          await Promise.all(
            employeeLWOP.map(
              async (employeeLwopItem: {
                employeeId: string;
                employeeName: string;
                companyId: string;
                leaveDescription: string;
                dates: string;
                noOfDays: number;
              }) => {
                const { dates, ...rest } = employeeLwopItem;
                const datesFromTo = dates.split(', ');
                const dateFrom = datesFromTo[0];
                const dateTo = datesFromTo[datesFromTo.length - 1];
                _employeesLWOP.push({ ...rest, dateFrom, dateTo });
              }
            )
          );
        }
      })
    );
    return _employeesLWOP;
  }

  async generateReport(user: User, report: Report, dateFrom?: Date, dateTo?: Date, monthYear?: string) {
    if (user === null) throw new ForbiddenException();
    let reportDetails: object;
    switch (report) {
      case decodeURI(Report.REPORT_ON_ATTENDANCE):
        reportDetails = await this.generateReportOnAttendance(dateFrom, dateTo);
        break;
      //#region Report About Pass Slips
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
      //#endregion Report About Pass Slips
      //#region Report About Leaves
      case decodeURI(Report.REPORT_ON_EMPLOYEE_FORCED_LEAVE_CREDITS):
        if (monthYear) reportDetails = await this.generateReportOnEmployeeForcedLeaveCredits(monthYear);
        break;
      case decodeURI(Report.REPORT_ON_EMPLOYEE_LEAVE_CREDIT_BALANCE):
        if (monthYear) reportDetails = await this.generateReportOnEmployeeLeaveCreditBalance(monthYear);
        break;
      case decodeURI(Report.REPORT_ON_EMPLOYEE_LEAVE_CREDIT_BALANCE_WITH_MONEY):
        if (monthYear) reportDetails = await this.generateReportOnEmployeeLeaveCreditBalanceWithMoney(monthYear);
        break;
      case decodeURI(Report.REPORT_ON_SUMMARY_OF_LEAVE_WITHOUT_PAY):
        if (monthYear) reportDetails = await this.generateReportOnSummaryOfLeaveWithoutPay(monthYear);
        break;
      //#endregion Report About Leaves
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
