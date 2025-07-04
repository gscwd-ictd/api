import { ForbiddenException, HttpException, Injectable, Next, NotFoundException } from '@nestjs/common';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { NatureOfAppointment, NatureOfBusiness, Report, User } from '@gscwd-api/utils';
import dayjs = require('dayjs');

@Injectable()
export class ReportsService {
  constructor(private readonly employeesService: EmployeesService, private readonly dtrService: DailyTimeRecordService) {}

  async generateReportOnAttendance(dateFrom: Date, dateTo: Date) {
    try {
      const employees = await this.employeesService.getAllPermanentCasualEmployees2();

      const employeeAttendance = await Promise.all(
        employees.map(async (employee) => {
          const name = employee.label;
          const report = (
            await this.dtrService.rawQuery(`CALL sp_generate_report_on_attendance_v3(?,?,?);`, [employee.value, dateFrom, dateTo])
          )[0][0];
          return { name, ...report };
        })
      );
      return employeeAttendance;
    } catch (error) {
      console.log(error);
    }
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

  async generateReportOnSummaryOfSickLeave(dateFrom: Date, dateTo: Date, employeeId?: string) {
    let leaveApplications;
    if (typeof employeeId === 'undefined' || employeeId === '') {
      leaveApplications = await this.dtrService.rawQuery(
        `
        SELECT 
        employee_id_fk employeeId,
        leave_application_id leaveApplicationId,
        GROUP_CONCAT(lad.leave_date ORDER BY lad.leave_date ASC SEPARATOR ', ') leaveDates, 
        DATE_FORMAT(la.date_of_filing,'%Y-%m-%d') dateOfFiling,
          COALESCE(in_hospital, out_patient) reason FROM leave_application la 
              INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
              INNER JOIN leave_benefits lb ON la.leave_benefits_id_fk = lb.leave_benefits_id
              INNER JOIN leave_card_ledger_debit lcld ON  lcld.leave_application_id_fk = la.leave_application_id
          WHERE la.status = 'approved' AND lad.status = 'approved' AND lb.leave_name = 'Sick Leave' 
          AND la.date_of_filing BETWEEN DATE_SUB(?, INTERVAL 1 DAY) AND DATE_ADD(?,INTERVAL 1 DAY) 
          GROUP BY leave_application_id ORDER BY DATE_FORMAT(la.date_of_filing,'%Y-%m-%d') ASC; 
      `,
        [dateFrom, dateTo]
      );
    } else {
      leaveApplications = await this.dtrService.rawQuery(
        `
        SELECT 
        employee_id_fk employeeId,
        leave_application_id leaveApplicationId,
        GROUP_CONCAT(lad.leave_date ORDER BY lad.leave_date ASC SEPARATOR ', ') leaveDates, 
        DATE_FORMAT(la.date_of_filing,'%Y-%m-%d') dateOfFiling,
        COALESCE(in_hospital, out_patient) reason FROM leave_application la 
              INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
              INNER JOIN leave_benefits lb ON la.leave_benefits_id_fk = lb.leave_benefits_id
              INNER JOIN leave_card_ledger_debit lcld ON  lcld.leave_application_id_fk = la.leave_application_id
          WHERE la.status = 'approved' AND lad.status = 'approved' AND lb.leave_name = 'Sick Leave' 
          AND la.date_of_filing BETWEEN DATE_SUB(?, INTERVAL 1 DAY) AND DATE_ADD(?,INTERVAL 1 DAY) AND employee_id_fk = ?
          GROUP BY leave_application_id ORDER BY DATE_FORMAT(la.date_of_filing,'%Y-%m-%d') ASC;
      `,
        [dateFrom, dateTo, employeeId]
      );
    }
    const leaveDetails = await Promise.all(
      leaveApplications.map(async (leaveApplication) => {
        const { employeeId } = leaveApplication;
        const employeeDetails = await this.employeesService.getBasicEmployeeDetails(employeeId);
        const employeeName = await this.employeesService.getEmployeeName(employeeId);
        const period = (
          await this.dtrService.rawQuery(
            `SELECT 
              DISTINCT DATE_FORMAT(COALESCE(la.hrmo_approval_date, la.supervisor_approval_date, la.hrdm_approval_date, lcld.created_at),'%Y-%m-%d') period 
                FROM leave_card_ledger_debit lcld 
              INNER JOIN leave_application la ON la.leave_application_id = lcld.leave_application_id_fk 
            WHERE lcld.leave_application_id_fk = ?;`,
            [leaveApplication.leaveApplicationId]
          )
        )[0].period;

        const sickLeaveBalance = (
          await this.dtrService.rawQuery(`CALL  sp_get_employee_ledger_by_range(?,?,?,?);`, [employeeId, employeeDetails.companyId, period, period])
        )[0];

        return {
          companyId: employeeDetails.companyId,
          name: employeeName,
          sickLeaveBalance: sickLeaveBalance[sickLeaveBalance.length - 1].sickLeaveBalance,
          dateOfFiling: leaveApplication.dateOfFiling,
          dates: leaveApplication.leaveDates,
          reason: leaveApplication.reason,
        };
      })
    );
    return leaveDetails.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
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

  async generateReportOnPersonalPassSlipDetailedCosJo(dateFrom: Date, dateTo: Date) {
    const employees = await this.employeesService.getEmployeesByNatureOfAppointment(NatureOfAppointment.JOBORDER);

    const _employeePassSlips = [];

    const employeePassSlips = await Promise.all(
      employees.map(async (employee) => {
        const employeeId = employee.employeeId;
        const name = employee.fullName;

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
    return _employeePassSlips.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
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
    return _employeePassSlips.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  async generateReportOnOfficialBusinessPassSlipDetailed(dateFrom: Date, dateTo: Date, employeeId: string) {
    let employees;
    if (employeeId !== '') {
      const employeeDetails = await this.employeesService.getEmployeeDetails(employeeId);
      employees = [{ label: employeeDetails.employeeFullName, value: employeeId }];
    } else employees = await this.employeesService.getAllPermanentCasualEmployees2();
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
    return _employeePassSlips.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  async generateReportOnUnusedPassSlips(dateFrom: Date, dateTo: Date, natureOfBusiness: NatureOfBusiness) {
    const result = (await this.dtrService.rawQuery(
      `
      SELECT 
          pass_slip_id passSlipId,
          ${process.env.HRMS_DB_NAME}get_company_id_by_employee_id(employee_id_fk) companyId,
          ${process.env.HRMS_DB_NAME}get_employee_fullname2(employee_id_fk) name,
          date_format(ps.created_at, '%Y-%m-%d %H:%i:%s') dateApplied,
          ${process.env.HRMS_DB_NAME}get_employee_fullname2(supervisor_id_fk) approvedBy,
          date_format(psa.supervisor_approval_date, '%Y-%m-%d %H:%i:%s') dateApproved,
          nature_of_business natureOfBusiness,
          purpose_destination purpose,
          status
        FROM
            pass_slip ps
                INNER JOIN
            pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
      WHERE
          psa.status = 'unused' AND nature_of_business = ? 
          AND ps.created_at >= ? AND ps.created_at <= ?  
      ORDER BY ${process.env.HRMS_DB_NAME}get_employee_fullname2(employee_id_fk) ASC;
    `,
      [natureOfBusiness, dateFrom, dateTo]
    )) as {
      passSlipId: string;
      companyId: string;
      fullName: string;
      dateApplied: Date;
      approvedBy: string;
      natureOfBusiness: NatureOfBusiness;
      purpose: string;
    }[];
    return result;
  }

  async generateReportOnEmployeeForcedLeaveCredits(monthYear: string) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

    const vlFlBalance = await Promise.all(
      employees.map(async (employee) => {
        const { value, label } = employee;
        const employeeDetails = await this.employeesService.getEmployeeDetails(value);
        const { companyId } = employeeDetails;
        const leaveDetails = (await this.dtrService.rawQuery(`CALL sp_get_employee_ledger_by_month_year(?,?,?);`, [value, companyId, monthYear]))[0];
        const { forcedLeaveBalance, vacationLeaveBalance } = leaveDetails[leaveDetails.length - 1];
        return {
          companyId,
          name: label,
          forcedLeaveBalance: parseFloat(forcedLeaveBalance).toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }),
          vacationLeaveBalance: parseFloat(vacationLeaveBalance).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
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
        const leaveDetails = (await this.dtrService.rawQuery(`CALL sp_get_employee_ledger_by_month_year(?,?,?);`, [value, companyId, monthYear]))[0];
        const { sickLeaveBalance, vacationLeaveBalance } = leaveDetails[leaveDetails.length - 1];

        const totalVacationLeave = parseFloat(
          parseFloat(vacationLeaveBalance).toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        );

        return {
          companyId,
          name: label,
          sickLeaveBalance: parseFloat(sickLeaveBalance).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
          vacationLeaveBalance: totalVacationLeave.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
          totalLeaveBalance: (totalVacationLeave + parseFloat(sickLeaveBalance)).toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
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
        const leaveDetails = (await this.dtrService.rawQuery(`CALL sp_get_employee_ledger_by_month_year(?,?,?);`, [value, companyId, monthYear]))[0];
        const year = dayjs(monthYear + '-01').year();
        const { sickLeaveBalance, vacationLeaveBalance } = leaveDetails[leaveDetails.length - 1];

        const monthlyRate = (await this.dtrService.rawQuery(`SELECT get_salary_grade_amount_by_employee_id_year(?,?) amount;`, [value, year]))[0]
          .amount as number;

        const totalVacationLeave = parseFloat(
          parseFloat(vacationLeaveBalance).toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })
        );

        return {
          companyId,
          name: label,
          vacationLeaveBalance: totalVacationLeave.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
          sickLeaveBalance: sickLeaveBalance.toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }),
          totalLeaveBalance: (totalVacationLeave + parseFloat(sickLeaveBalance)).toLocaleString(undefined, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }),
          monthlyRate: monthlyRate.toLocaleString(),
          conversion: (
            (parseFloat((monthlyRate * (totalVacationLeave + parseFloat(sickLeaveBalance))).toString()) * 0.0481927 * 100) /
            100
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        };
      })
    );
    return leaveCreditBalance;
  }

  async generateReportOnSummaryOfLeaveWithoutPay(monthYear: string) {
    const employees = await this.employeesService.getAllPermanentCasualEmployees2();

    const _employeesLWOP = [];

    await Promise.all(
      employees.map(async (employee) => {
        const employeeDetails = await this.employeesService.getEmployeeDetails(employee.value);
        const { companyId } = employeeDetails;
        const employeeLWOP = (
          await this.dtrService.rawQuery(`CALL sp_generate_report_on_lwop_summary(?,?,?,?);`, [employee.value, employee.label, companyId, monthYear])
        )[0];

        console.log(employeeLWOP);
        if (employeeLWOP) {
          await Promise.all(
            employeeLWOP.map(
              async (employeeLwopItem: {
                employeeId: string;
                employeeName: string;
                companyId: string;
                leaveDescription: string;
                justification: string;
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
    return _employeesLWOP.sort((a, b) => (a.dateFrom < b.dateFrom ? -1 : a.dateFrom > b.dateFrom ? 1 : 0));
  }

  async generateReportOnRehabilitationLeave(dateFrom: Date, dateTo: Date, employeeId?: string) {
    let leaveApplications;
    if (typeof employeeId === 'undefined' || employeeId === '') {
      leaveApplications = await this.dtrService.rawQuery(
        `
        SELECT 
        employee_id_fk employeeId,
        leave_application_id leaveApplicationId,
        count(distinct leave_application_id) leaveCount,
        GROUP_CONCAT(distinct get_leave_date_range(leave_application_id,true) ORDER BY lad.leave_date ASC SEPARATOR ', ') leaveDates, 
        GROUP_CONCAT(DISTINCT DATE_FORMAT(la.date_of_filing,'%Y-%m-%d') ORDER BY la.date_of_filing ASC SEPARATOR ', ') dateOfFiling 
      FROM leave_application la 
                INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
                INNER JOIN leave_benefits lb ON la.leave_benefits_id_fk = lb.leave_benefits_id
                INNER JOIN leave_card_ledger_debit lcld ON  lcld.leave_application_id_fk = la.leave_application_id
            WHERE la.status = 'approved' AND lad.status = 'approved' AND lb.leave_name = 'Rehabilitation Leave' 
            AND la.date_of_filing BETWEEN DATE_SUB(?, INTERVAL 1 DAY) AND DATE_ADD(?,INTERVAL 1 DAY) 
            GROUP BY leave_application_id ORDER BY DATE_FORMAT(la.date_of_filing,'%Y-%m-%d') ASC; 
      `,
        [dateFrom, dateTo]
      );
    } else {
      leaveApplications = await this.dtrService.rawQuery(
        `
        SELECT 
        employee_id_fk employeeId,
        leave_application_id leaveApplicationId,
        count(distinct leave_application_id) leaveCount,
        GROUP_CONCAT(distinct get_leave_date_range(leave_application_id,true) ORDER BY lad.leave_date ASC SEPARATOR ', ') leaveDates, 
        GROUP_CONCAT(DISTINCT DATE_FORMAT(la.date_of_filing,'%Y-%m-%d') ORDER BY la.date_of_filing ASC SEPARATOR ', ') dateOfFiling 
      FROM leave_application la 
                INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
                INNER JOIN leave_benefits lb ON la.leave_benefits_id_fk = lb.leave_benefits_id
                INNER JOIN leave_card_ledger_debit lcld ON  lcld.leave_application_id_fk = la.leave_application_id
            WHERE la.status = 'approved' AND lad.status = 'approved' AND lb.leave_name = 'Rehabilitation Leave' 
            AND la.date_of_filing BETWEEN DATE_SUB(?, INTERVAL 1 DAY) AND DATE_ADD(?,INTERVAL 1 DAY)  AND employee_id_fk = ? 
            GROUP BY leave_application_id ORDER BY DATE_FORMAT(la.date_of_filing,'%Y-%m-%d') ASC; 
      `,
        [dateFrom, dateTo, employeeId]
      );
    }

    const leaveDetails = await Promise.all(
      leaveApplications.map(async (leaveApplication) => {
        const { employeeId, leaveCount, leaveDates, dateOfFiling } = leaveApplication;
        //const {} = leaveApplication;
        const employeeDetails = await this.employeesService.getEmployeeDetails(employeeId);
        const employeeName = await this.employeesService.getEmployeeName(employeeId);
        return { name: employeeName, leaveCount, leaveDates, dateOfFiling };
      })
    );

    return leaveDetails.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  }

  async generateReportOnPassSlipDeductibleToPay(monthYear: string) {
    //get all deductible to pay pass slips (pb,undertime,halfday)
    /*
     * Employee Name
     * Pass slip date
     * Actual pass slip time log
     * Number of hours
     * Salary deduction computation
     * Remarks(Reason of pass slip)
     */
    try {
      const employeeIdsPassSlipByMonthYear = (
        (await this.dtrService.rawQuery(
          `
          SELECT DISTINCT employee_id_fk employeeId FROM pass_slip ps 
            INNER JOIN pass_slip_approval psa ON ps.pass_slip_id=psa.pass_slip_id_fk
          WHERE psa.status = 'approved' AND ps.is_deductible_to_pay = true 
          AND DATE_FORMAT(ps.date_of_application,'%Y-%m') = ? 
          AND ps.time_out IS NOT NULL;
        `,
          [monthYear]
        )) as { employeeId: string }[]
      ).map((employee) => employee.employeeId);

      let jo,
        casual,
        permanent = [];
      const employeesJo = await this.employeesService.getEmployeesByNatureOfAppointmentAndEmployeeIds(
        NatureOfAppointment.JOBORDER,
        employeeIdsPassSlipByMonthYear
      );

      await Promise.all(
        employeesJo.map(async (employee) => {
          const { employeeId, fullName } = employee;

          const passSlipDetails = (await this.dtrService.rawQuery(
            `
            SELECT 
                DATE_FORMAT(date_of_application, '%Y-%m-%d') psDate,
                get_pass_slip_total_minutes_consumed(ps.pass_slip_id) noOfMinConsumed,
                TRUNCATE(get_pass_slip_total_minutes_consumed(ps.pass_slip_id)/60*.125,3) conversion,
                get_time_out_in_personal_business_pass_slip_detailed(ps.pass_slip_id) timeInTimeOut,
                ps.purpose_destination remarks
              FROM 
            pass_slip ps INNER JOIN pass_slip_approval psa ON ps.pass_slip_id = psa.pass_slip_id_fk 
            WHERE employee_id_fk = ? AND DATE_FORMAT(date_of_application, '%Y-%m') = ? 
            AND nature_of_business IN ('personal business','half day','undertime') AND psa.status = 'approved' 
            AND (time_out IS NOT NULL OR encoded_time_out IS NOT NULL) ORDER BY psDate ASC;
          `,
            [employeeId, monthYear]
          )) as { noOfMinConsumed: number; conversion: number; psDate: Date; timeInTimeOut: string; remarks: string }[];

          const joPassSlipDeductibleToPayWithComputation = await Promise.all(
            passSlipDetails.map(async (passSlipDetail) => {
              const dailyRate = parseFloat((await this.employeesService.getSalaryGradeOrDailyRateByEmployeeId(employeeId)).dailyRate.toString());
              const { noOfMinConsumed, psDate, conversion, timeInTimeOut, remarks } = passSlipDetail;
              const salaryDeductionComputation = Math.round(conversion * dailyRate * 100) / 100;
              return {
                employeeId,
                fullName,
                numberOfHours: Math.round((noOfMinConsumed / 60) * 100) / 100,
                salaryDeductionComputation,
                dateOfApplication: psDate,
                timeInTimeOut,
                remarks,
              };
            })
          );

          jo = joPassSlipDeductibleToPayWithComputation;
        })
      );

      const employeesCasual = await this.employeesService.getEmployeesByNatureOfAppointmentAndEmployeeIds(
        NatureOfAppointment.CASUAL,
        employeeIdsPassSlipByMonthYear
      );

      await Promise.all(
        employeesCasual.map(async (employee) => {
          const { employeeId, fullName } = employee;

          const passSlipDetails = (await this.dtrService.rawQuery(
            `
            SELECT 
                DATE_FORMAT(date_of_application, '%Y-%m-%d') psDate,
                get_pass_slip_total_minutes_consumed(ps.pass_slip_id) noOfMinConsumed,
                TRUNCATE(get_pass_slip_total_minutes_consumed(ps.pass_slip_id)/60*.125,3) conversion,
                get_time_out_in_personal_business_pass_slip_detailed(ps.pass_slip_id) timeInTimeOut,
                ps.purpose_destination remarks
              FROM 
            pass_slip ps INNER JOIN pass_slip_approval psa ON ps.pass_slip_id = psa.pass_slip_id_fk 
            WHERE employee_id_fk = ? AND DATE_FORMAT(date_of_application, '%Y-%m') = ? 
            AND nature_of_business IN ('personal business','half day','undertime') AND psa.status = 'approved' 
            AND (time_out IS NOT NULL OR encoded_time_out IS NOT NULL) ORDER BY psDate ASC;
          `,
            [employeeId, monthYear]
          )) as { noOfMinConsumed: number; conversion: number; psDate: Date; timeInTimeOut: string; remarks: string }[];

          const casualPassSlipDeductibleToPayWithComputation = await Promise.all(
            passSlipDetails.map(async (passSlipDetail) => {
              // const dailyRate = parseFloat(
              //   (await this.employeesService.getSalaryGradeOrDailyRateByEmployeeId(employeeId)).salaryGradeAmount.toString()
              // );
              const dailyRate = (await this.employeesService.getSalaryGradeOrDailyRateByEmployeeId(employeeId)).salaryGradeAmount / 22;
              const { noOfMinConsumed, psDate, conversion, timeInTimeOut, remarks } = passSlipDetail;
              const salaryDeductionComputation = Math.round(conversion * dailyRate * 100) / 100;
              return {
                employeeId,
                fullName,
                numberOfHours: Math.floor((noOfMinConsumed / 60) * 100) / 100,
                salaryDeductionComputation,
                dateOfApplication: psDate,
                timeInTimeOut,
                remarks,
              };
            })
          );
          casual = casualPassSlipDeductibleToPayWithComputation;
        })
      );

      const employeesPermanent = await this.employeesService.getEmployeesByNatureOfAppointmentAndEmployeeIds(
        NatureOfAppointment.PERMANENT,
        employeeIdsPassSlipByMonthYear
      );

      await Promise.all(
        employeesPermanent.map(async (employee) => {
          const { employeeId, fullName } = employee;

          const passSlipDetails = (await this.dtrService.rawQuery(
            `
            SELECT 
                DATE_FORMAT(date_of_application, '%Y-%m-%d') psDate,
                get_pass_slip_total_minutes_consumed(ps.pass_slip_id) noOfMinConsumed,
                TRUNCATE(get_pass_slip_total_minutes_consumed(ps.pass_slip_id)/60*.125,3) conversion,
                get_time_out_in_personal_business_pass_slip_detailed(ps.pass_slip_id) timeInTimeOut,
                ps.purpose_destination remarks
              FROM 
            pass_slip ps INNER JOIN pass_slip_approval psa ON ps.pass_slip_id = psa.pass_slip_id_fk 
            WHERE employee_id_fk = ? AND DATE_FORMAT(date_of_application, '%Y-%m') = ? 
            AND nature_of_business IN ('personal business','half day','undertime') AND psa.status = 'approved' 
            AND (time_out IS NOT NULL OR encoded_time_out IS NOT NULL) ORDER BY psDate ASC;
          `,
            [employeeId, monthYear]
          )) as { noOfMinConsumed: number; conversion: number; psDate: Date; timeInTimeOut: string; remarks: string }[];

          const permanentPassSlipDeductibleToPayWithComputation = await Promise.all(
            passSlipDetails.map(async (passSlipDetail) => {
              const dailyRate = (await this.employeesService.getSalaryGradeOrDailyRateByEmployeeId(employeeId)).salaryGradeAmount / 22;
              const { noOfMinConsumed, psDate, conversion, timeInTimeOut, remarks } = passSlipDetail;
              const salaryDeductionComputation = Math.round(conversion * dailyRate * 100) / 100;
              return {
                employeeId,
                fullName,
                numberOfHours: Math.floor((noOfMinConsumed / 60) * 100) / 100,
                salaryDeductionComputation,
                dateOfApplication: psDate,
                timeInTimeOut,
                remarks,
              };
            })
          );
          permanent = permanentPassSlipDeductibleToPayWithComputation;
        })
      );

      return {
        jo,
        casual,
        permanent,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async generateReportOnLeaveApplicationLateFiling(dateFrom: Date, dateTo: Date) {
    try {
      return (await this.dtrService.rawQuery(`CALL sp_get_late_filed_leave_application_by_date_range(?,?);`, [dateFrom, dateTo]))[0];
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async generateReport(
    user: User,
    report: Report,
    dateFrom?: Date,
    dateTo?: Date,
    monthYear?: string,
    employeeId?: string,
    natureOfBusiness?: NatureOfBusiness
  ) {
    try {
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
        case decodeURI(Report.REPORT_ON_PERSONAL_BUSINESS_DETAILED_COS_JO):
          reportDetails = await this.generateReportOnPersonalPassSlipDetailedCosJo(dateFrom, dateTo);
          break;
        case decodeURI(Report.REPORT_ON_OFFICIAL_BUSINESS_DETAILED):
          reportDetails = await this.generateReportOnOfficialBusinessPassSlipDetailed(dateFrom, dateTo, employeeId);
          break;
        case decodeURI(Report.REPORT_ON_UNUSED_PASS_SLIP):
          console.log(natureOfBusiness);
          reportDetails = await this.generateReportOnUnusedPassSlips(dateFrom, dateTo, natureOfBusiness);
          break;
        case decodeURI(Report.REPORT_ON_SUMMARY_OF_SICK_LEAVE):
          reportDetails = await this.generateReportOnSummaryOfSickLeave(dateFrom, dateTo, employeeId);
          break;
        case decodeURI(Report.REPORT_ON_REHABILITATION_LEAVE):
          reportDetails = await this.generateReportOnRehabilitationLeave(dateFrom, dateTo, employeeId);
          break;
        case decodeURI(Report.REPORT_ON_PASS_SLIP_DEDUCTIBLE_TO_PAY):
          if (monthYear) reportDetails = await this.generateReportOnPassSlipDeductibleToPay(monthYear);
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
        case decodeURI(Report.REPORT_ON_LEAVE_APPLICATION_LATE_FILING):
          reportDetails = await this.generateReportOnLeaveApplicationLateFiling(dateFrom, dateTo);
          break;
        //#endregion Report About Leaves
        default:
          break;
      }

      const employeeDetails = await this.employeesService.getEmployeeDetails(user.employeeId);

      const reviewedBy = (
        await this.dtrService.rawQuery(`SELECT
      ${process.env.HRMS_DB_NAME}get_employee_fullname2(pp.employee_id_fk) employeeFullName,
          pp.position_title positionTitle
      FROM ${process.env.HRMS_DB_NAME}plantilla_positions pp WHERE item_number ='ADM-RPW-002';`)
      )[0];

      const supervisorId = await this.employeesService.getEmployeeSupervisorId(user.employeeId);
      const supervisorDetails = await this.employeesService.getEmployeeDetails(supervisorId.toString());

      return {
        report: reportDetails,
        signatory: {
          preparedBy: { name: user.name, positionTitle: employeeDetails.assignment.positionTitle },
          reviewedBy: { name: reviewedBy.employeeFullName, positionTitle: reviewedBy.positionTitle },
          approvedBy: { name: supervisorDetails.employeeFullName, positionTitle: supervisorDetails.assignment.positionTitle },
        },
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
