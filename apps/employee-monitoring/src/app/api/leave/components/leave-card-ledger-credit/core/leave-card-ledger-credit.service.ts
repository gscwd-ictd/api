import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LeaveBenefits, LeaveBenefitsIds, LeaveCardLedgerCredit, LeaveCreditEarnings } from '@gscwd-api/models';
import { LeaveLedger } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Dayjs } from 'dayjs';
import dayjs = require('dayjs');
import { DataSource, EntityManager } from 'typeorm';
import { EmployeesService } from '../../../../employees/core/employees.service';
import { LeaveCreditEarningsService } from '../../leave-credit-earnings/core/leave-credit-earnings.service';

@Injectable()
export class LeaveCardLedgerCreditService extends CrudHelper<LeaveCardLedgerCredit> {
  constructor(
    private readonly crudService: CrudService<LeaveCardLedgerCredit>,
    private readonly employeeService: EmployeesService,
    private readonly leaveCreditEarnings: LeaveCreditEarningsService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  @Cron('0 0 0 1 1 *')
  async creditRecurringLeaves() {
    const employees = await this.employeeService.getAllPermanentEmployeeIds();
    //select all cumulative and val
    const leaveBenefits = (await this.rawQuery(
      `SELECT leave_benefits_id leaveBenefitsId, accumulated_credits accumulatedCredits 
          FROM employee_monitoring.leave_benefits 
       WHERE credit_distribution = 'yearly' AND leave_types = 'recurring';`
    )) as { leaveBenefitsId: LeaveBenefits; accumulatedCredits: string }[];

    const creditDate = dayjs().toDate();
    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const credits = await Promise.all(
        employees.map(async (employee) => {
          const { employeeId } = employee;

          const leaveCredits = await Promise.all(
            leaveBenefits.map(async (leaveBenefit) => {
              const leaveCreditEarning = await this.leaveCreditEarnings.addLeaveCreditEarningsTransaction(
                {
                  employeeId,
                  creditDate,
                  creditValue: parseFloat(leaveBenefit.accumulatedCredits),
                  leaveBenefitsId: leaveBenefit.leaveBenefitsId,
                },
                entityManager
              );

              const leaveCardLedgerCredit = await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
                dto: {
                  leaveCreditEarningId: leaveCreditEarning,
                },
              });
              return { leaveCreditEarning, leaveCardLedgerCredit };
            })
          );
          return leaveCredits;
        })
      );
    });
    console.log('Annual Leave Credit Earnings Addition executed');
  }

  @Cron('0 0 0 1 1 *')
  async creditBeginningBalance() {
    //
    const employees = await this.employeeService.getAllPermanentEmployeeIds();

    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const credits = await Promise.all(
        employees.map(async (employee, idx) => {
          const { employeeId, companyId } = employee;
          const employeeLeaveLedger = (await this.rawQuery(`CALL sp_generate_leave_ledger_view(?,?)`, [employeeId, companyId]))[0] as LeaveLedger[];
          const beginningBalance = employeeLeaveLedger[employeeLeaveLedger.length - 1];
          //if (idx === employees.length - 1) {
          const { sickLeaveBalance, vacationLeaveBalance, specialLeaveBenefitBalance, specialPrivilegeLeaveBalance } = beginningBalance;
          //console.log(forcedLeaveBalance);
          const leaveBenefits = (
            await this.rawQuery<string, LeaveBenefitsIds[]>(`SELECT 
            (SELECT leave_benefits_id FROM leave_benefits WHERE leave_name = 'Forced Leave' LIMIT 1) forcedLeaveId, 
            (SELECT leave_benefits_id FROM leave_benefits WHERE leave_name = 'Sick Leave' LIMIT 1) sickLeaveId, 
            (SELECT leave_benefits_id FROM leave_benefits WHERE leave_name = 'Vacation Leave' LIMIT 1) vacationLeaveId,
            (SELECT leave_benefits_id FROM leave_benefits WHERE leave_name = 'Special Privilege Leave' LIMIT 1) specialPrivilegeLeaveId;`)
          )[0];
          //}
          const { forcedLeaveId, sickLeaveId, vacationLeaveId, specialPrivilegeLeaveId } = leaveBenefits;
          const creditDate = dayjs(dayjs().add(0, 'year').year() + '-01-01').toDate();

          const forcedLeaveCredit = await this.leaveCreditEarnings
            .crud()
            .transact<LeaveCreditEarnings>(entityManager)
            .create({
              dto: {
                leaveBenefitsId: forcedLeaveId,
                employeeId,
                creditValue: 0,
                creditDate,
              },
              onError: () => new InternalServerErrorException(),
            });

          //console.log(forcedLeaveCredit);

          await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
            dto: {
              leaveCreditEarningId: forcedLeaveCredit,
            },
          });

          const sickLeaveCredit = await this.leaveCreditEarnings
            .crud()
            .transact<LeaveCreditEarnings>(entityManager)
            .create({
              dto: {
                leaveBenefitsId: sickLeaveId,
                employeeId,
                creditValue: sickLeaveBalance,
                creditDate,
              },
              onError: () => new InternalServerErrorException(),
            });

          await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
            dto: {
              leaveCreditEarningId: sickLeaveCredit,
            },
          });

          const vacationLeaveCredit = await this.leaveCreditEarnings
            .crud()
            .transact<LeaveCreditEarnings>(entityManager)
            .create({
              dto: {
                leaveBenefitsId: vacationLeaveId,
                employeeId,
                creditValue: vacationLeaveBalance,
                creditDate,
              },
              onError: () => new InternalServerErrorException(),
            });

          await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
            dto: {
              leaveCreditEarningId: vacationLeaveCredit,
            },
          });

          const specialLeavePrivilegeCredit = await this.leaveCreditEarnings
            .crud()
            .transact<LeaveCreditEarnings>(entityManager)
            .create({
              dto: {
                leaveBenefitsId: specialPrivilegeLeaveId,
                employeeId,
                creditValue: 0,
                creditDate,
              },
              onError: () => new InternalServerErrorException(),
            });

          await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
            dto: {
              leaveCreditEarningId: specialLeavePrivilegeCredit,
            },
          });
        })
      );
    });
  }

  @Cron('0 0 0 1 * *')
  async creditCumulativeLeaves() {
    const employees = await this.employeeService.getAllPermanentEmployeeIds();
    //select all cumulative and val
    const leaveBenefits = (await this.rawQuery(
      `SELECT leave_benefits_id leaveBenefitsId, accumulated_credits accumulatedCredits 
          FROM employee_monitoring.leave_benefits 
       WHERE credit_distribution = 'monthly' AND leave_types = 'cumulative';`
    )) as { leaveBenefitsId: LeaveBenefits; accumulatedCredits: string }[];
    const creditDate = dayjs().toDate();
    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const credits = await Promise.all(
        employees.map(async (employee) => {
          const { employeeId } = employee;

          const leaveCredits = await Promise.all(
            leaveBenefits.map(async (leaveBenefit) => {
              const leaveCreditEarning = await this.leaveCreditEarnings.addLeaveCreditEarningsTransaction(
                {
                  employeeId,
                  creditDate,
                  creditValue: parseFloat(leaveBenefit.accumulatedCredits),
                  leaveBenefitsId: leaveBenefit.leaveBenefitsId,
                },
                entityManager
              );

              const leaveCardLedgerCredit = await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
                dto: {
                  leaveCreditEarningId: leaveCreditEarning,
                },
              });
              return { leaveCreditEarning, leaveCardLedgerCredit };
            })
          );
          return leaveCredits;
        })
      );
    });
    console.log('Monthly Leave Credit Earnings Addition executed');
  }
}
