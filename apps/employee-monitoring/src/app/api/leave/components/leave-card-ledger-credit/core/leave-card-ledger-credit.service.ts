import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveCardLedgerCreditDto, LeaveBenefits, LeaveBenefitsIds, LeaveCardLedgerCredit, LeaveCreditEarnings } from '@gscwd-api/models';
import { LeaveLedger } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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

  async addLeaveCardLedgerCreditTransaction(leaveCardLedgerCreditDto: CreateLeaveCardLedgerCreditDto, entityManager: EntityManager) {
    const leaveCardLedgerCredit = await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
      dto: leaveCardLedgerCreditDto,
      onError: () => new InternalServerErrorException(),
    });
  }

  @Cron('0 0 0 1 1 *')
  async creditRecurringLeaves() {
    const employees = await this.employeeService.getAllPermanentEmployeeIds();
    //select all cumulative and val
    const leaveBenefits = (await this.rawQuery(
      `SELECT leave_benefits_id leaveBenefitsId, accumulated_credits accumulatedCredits 
          FROM employee_monitoring.leave_benefits 
       WHERE credit_distribution = 'yearly' AND leave_types = 'recurring' AND deleted_at IS NULL;`
    )) as { leaveBenefitsId: LeaveBenefits; accumulatedCredits: string }[];

    const monthNow = dayjs().month() + 1;
    const creditDate = dayjs(dayjs().year() + '-01' + '-01').toDate();

    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const credits = await Promise.all(
        employees.map(async (employee) => {
          const { employeeId } = employee;
          const createdAt = dayjs(
            //dayjs().year() + '-01-01 ' + dayjs().add(2, 'hours').hour() + ':' + dayjs().minute() + ':' + dayjs().second()
            dayjs().year() + '-01-01 ' + '02' + ':' + dayjs().minute() + ':' + dayjs().second()
          ).toDate();
          const leaveCredits = await Promise.all(
            leaveBenefits.map(async (leaveBenefit) => {
              const leaveCreditEarning = await this.leaveCreditEarnings.addLeaveCreditEarningsTransaction(
                {
                  createdAt,
                  employeeId,
                  creditDate,
                  creditValue: parseFloat(leaveBenefit.accumulatedCredits),
                  leaveBenefitsId: leaveBenefit.leaveBenefitsId,
                  remarks: '',
                },
                entityManager
              );

              const leaveCardLedgerCredit = await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
                dto: {
                  createdAt,
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

  @Cron('0 57 23 31 12 *')
  async creditBeginningBalance() {
    const employees = await this.employeeService.getAllPermanentEmployeeIds();
    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const credits = await Promise.all(
        employees.map(async (employee, idx) => {
          const { employeeId, companyId } = employee;
          const employeeLeaveLedger = (await this.rawQuery(`CALL sp_get_employee_ledger(?,?)`, [employeeId, companyId]))[0] as LeaveLedger[];
          const beginningBalance = employeeLeaveLedger[employeeLeaveLedger.length - 1];

          try {
            const {
              sickLeaveBalance,
              vacationLeaveBalance,
              //specialLeaveBenefitBalance,
              specialPrivilegeLeaveBalance,
              forcedLeaveBalance,
              //specialPrivilegeLeave,
            } = beginningBalance;

            const leaveBenefits = (
              await this.rawQuery<string, LeaveBenefitsIds[]>(`SELECT 
            (SELECT leave_benefits_id FROM leave_benefits WHERE leave_name = 'Forced Leave' AND deleted_at IS NULL LIMIT 1) forcedLeaveId, 
            (SELECT leave_benefits_id FROM leave_benefits WHERE leave_name = 'Sick Leave' AND deleted_at IS NULL LIMIT 1) sickLeaveId, 
            (SELECT leave_benefits_id FROM leave_benefits WHERE leave_name = 'Vacation Leave' AND deleted_at IS NULL LIMIT 1) vacationLeaveId,
            (SELECT leave_benefits_id FROM leave_benefits WHERE leave_name = 'Special Privilege Leave' AND deleted_at IS NULL LIMIT 1) specialPrivilegeLeaveId;`)
            )[0];

            const { forcedLeaveId, sickLeaveId, vacationLeaveId, specialPrivilegeLeaveId } = leaveBenefits;
            const creditDate = dayjs(dayjs().add(0, 'year').year() + '-01-01').toDate();
            const createdAt = dayjs(
              dayjs().add(0, 'year').year() + '-01-01 ' + '00' + ':' + dayjs().minute() + ':' + dayjs().second()
              //dayjs().add(0, 'year').year() + '-01-01 ' + dayjs().hour() + ':' + dayjs().minute() + ':' + dayjs().second()
              //dayjs().add(0, 'year').year() + '-01-01 ' + '00' + ':' + '00' + ':' + '00'
            ).toDate();

            const forcedLeaveCredit = await this.leaveCreditEarnings
              .crud()
              .transact<LeaveCreditEarnings>(entityManager)
              .create({
                dto: {
                  createdAt,
                  leaveBenefitsId: forcedLeaveId,
                  employeeId,
                  creditValue: forcedLeaveBalance,
                  creditDate,
                  remarks: 'Beginning Balance',
                },
                onError: () => new InternalServerErrorException(),
              });

            await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
              dto: {
                createdAt,
                leaveCreditEarningId: forcedLeaveCredit,
              },
            });

            const specialLeavePrivilegeCredit = await this.leaveCreditEarnings
              .crud()
              .transact<LeaveCreditEarnings>(entityManager)
              .create({
                dto: {
                  createdAt,
                  leaveBenefitsId: specialPrivilegeLeaveId,
                  employeeId,
                  creditValue: specialPrivilegeLeaveBalance,
                  creditDate,
                  remarks: 'Beginning Balance',
                },
                onError: () => new InternalServerErrorException(),
              });

            await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
              dto: {
                createdAt,
                leaveCreditEarningId: specialLeavePrivilegeCredit,
              },
            });

            const sickLeaveCredit = await this.leaveCreditEarnings
              .crud()
              .transact<LeaveCreditEarnings>(entityManager)
              .create({
                dto: {
                  createdAt,
                  leaveBenefitsId: sickLeaveId,
                  employeeId,
                  creditValue: sickLeaveBalance,
                  creditDate,
                  remarks: 'Beginning Balance',
                },
                onError: () => new InternalServerErrorException(),
              });

            await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
              dto: {
                createdAt,
                leaveCreditEarningId: sickLeaveCredit,
              },
            });

            const vacationLeaveCredit = await this.leaveCreditEarnings
              .crud()
              .transact<LeaveCreditEarnings>(entityManager)
              .create({
                dto: {
                  createdAt,
                  leaveBenefitsId: vacationLeaveId,
                  employeeId,
                  creditValue: vacationLeaveBalance,
                  creditDate,
                  remarks: 'Beginning Balance',
                },
                onError: () => new InternalServerErrorException(),
              });

            await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
              dto: {
                createdAt,
                leaveCreditEarningId: vacationLeaveCredit,
              },
            });

            // const specialLeaveBenefitCredit = await this.leaveCreditEarnings
            //   .crud()
            //   .transact<LeaveCreditEarnings>(entityManager)
            //   .create({
            //     dto: {
            //       createdAt,
            //       employeeId,
            //       creditDate,
            //       creditValue: specialLeaveBenefitBalance,
            //       remarks: 'Beginning Balance',
            //     },
            //   });

            // await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
            //   dto: {
            //     createdAt,
            //     leaveCreditEarningId: specialLeaveBenefitCredit,
            //   },
            // });
          } catch (error) {
            console.log(error);
          }
        })
      );
    });
  }

  async creditCumulativeLeaves() {
    const employees = await this.employeeService.getAllPermanentEmployeeIds();
    //select all cumulative and val
    const leaveBenefits = (await this.rawQuery(
      `SELECT leave_benefits_id leaveBenefitsId, accumulated_credits accumulatedCredits 
          FROM employee_monitoring.leave_benefits 
       WHERE credit_distribution = 'monthly' AND leave_types = 'cumulative';`
    )) as { leaveBenefitsId: LeaveBenefits; accumulatedCredits: string }[];
    const creditDate = dayjs(dayjs().year() + '-01-01').toDate();

    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const credits = await Promise.all(
        employees.map(async (employee) => {
          const { employeeId } = employee;
          const createdAt = dayjs(
            dayjs().add(0, 'year').year() + '-03-01 ' + dayjs().add(2, 'hours').hour() + ':' + dayjs().minute() + ':' + dayjs().second()
          ).toDate();
          const leaveCredits = await Promise.all(
            leaveBenefits.map(async (leaveBenefit) => {
              const leaveCreditEarning = await this.leaveCreditEarnings.addLeaveCreditEarningsTransaction(
                {
                  createdAt,
                  employeeId,
                  creditDate,
                  creditValue: parseFloat(leaveBenefit.accumulatedCredits),
                  leaveBenefitsId: leaveBenefit.leaveBenefitsId,
                  remarks: '',
                },
                entityManager
              );

              const leaveCardLedgerCredit = await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
                dto: {
                  createdAt,
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

  @Cron('0 57 23 28-31 * *')
  async creditCumulativeLeavesManuallyCron() {
    if (dayjs().format('YYYY-MM-DD') === dayjs().endOf('month').format('YYYY-MM-DD'))
      return await this.creditCumulativeLeavesManually(dayjs().toDate());
  }

  async creditCumulativeLeavesManually(day: Date) {
    const employees = await this.employeeService.getAllPermanentEmployeeIds();

    const leaveBenefits = (await this.rawQuery(
      `SELECT leave_benefits_id leaveBenefitsId, accumulated_credits accumulatedCredits 
          FROM employee_monitoring.leave_benefits 
       WHERE credit_distribution = 'monthly' AND leave_types = 'cumulative' AND deleted_at IS NULL;`
    )) as { leaveBenefitsId: LeaveBenefits; accumulatedCredits: string }[];
    const creditDate = dayjs(day).toDate();

    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const credits = await Promise.all(
        employees.map(async (employee) => {
          const { employeeId } = employee;
          const createdAt = dayjs(day).add(1, 'hour').toDate();
          const leaveCredits = await Promise.all(
            leaveBenefits.map(async (leaveBenefit) => {
              const monthYear = dayjs(day).format('YYYY-MM');

              const lwopsForTheMonth = (await this.rawQuery(
                `
                  SELECT 
                    SUM(get_num_of_leave_days_by_year_month_hrdm_approval_date(la.leave_application_id, ?))
                  noOfDays
                  FROM leave_application la 
                    INNER JOIN leave_application_dates lad ON la.leave_application_id = lad.leave_application_id_fk
                    INNER JOIN leave_benefits lb ON la.leave_benefits_id_fk = lb.leave_benefits_id
                  WHERE la.employee_id_fk = ? 
                  AND lb.leave_name = 'Leave Without Pay' AND la.hrdm_approval_date IS NOT NULL 
                  AND DATE_FORMAT(la.hrdm_approval_date,'%Y') = DATE_FORMAT(CONCAT(?,'-01'),'%Y') 
                  AND DATE_FORMAT(la.hrdm_approval_date,'%m') = DATE_FORMAT(CONCAT(?,'-01'),'%m')
                  AND la.status = 'approved' AND lad.status='approved';
                `,
                [monthYear, employeeId, monthYear, monthYear]
              )) as { noOfDays: string }[];

              let lwopValue = 0;

              let rehabValue = parseFloat(
                (await this.rawQuery(`CALL get_rehabilitation_leaves_count_by_year_month(?,?);`, [monthYear, employeeId]))[0][0].rehabCount
              );

              rehabValue = rehabValue * 0.041666666666667;

              console.log('REHAB VALUE:', rehabValue);

              if (lwopsForTheMonth.length > 0) lwopValue = parseInt(lwopsForTheMonth[0].noOfDays) * 0.041666666666667;
              const leaveCreditEarning = await this.leaveCreditEarnings.addLeaveCreditEarningsTransaction(
                {
                  createdAt,
                  employeeId,
                  creditDate,
                  creditValue: parseFloat(leaveBenefit.accumulatedCredits) - lwopValue - rehabValue,
                  leaveBenefitsId: leaveBenefit.leaveBenefitsId,
                  remarks: '',
                },
                entityManager
              );

              const leaveCardLedgerCredit = await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
                dto: {
                  createdAt,
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
    return 'Monthly Leave Credit Earnings Addition executed';
  }

  async creditCumulativeLeavesManuallyWithValue(day: Date, creditValue: number) {
    const employees = await this.employeeService.getAllPermanentEmployeeIds();
    //select all cumulative and val
    const leaveBenefits = (await this.rawQuery(
      `SELECT leave_benefits_id leaveBenefitsId, accumulated_credits accumulatedCredits 
          FROM employee_monitoring.leave_benefits 
       WHERE credit_distribution = 'monthly' AND leave_types = 'cumulative' AND deleted_at IS NULL;`
    )) as { leaveBenefitsId: LeaveBenefits; accumulatedCredits: string }[];
    const creditDate = dayjs(day).toDate();

    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const credits = await Promise.all(
        employees.map(async (employee) => {
          const { employeeId } = employee;
          //dayjs(day).add(2, 'hours').hour() + ':' + dayjs().minute() + ':' + dayjs().second()
          const createdAt = dayjs(day).add(5, 'hour').toDate();
          const leaveCredits = await Promise.all(
            leaveBenefits.map(async (leaveBenefit) => {
              const leaveCreditEarning = await this.leaveCreditEarnings.addLeaveCreditEarningsTransaction(
                {
                  createdAt,
                  employeeId,
                  creditDate,
                  creditValue,
                  leaveBenefitsId: leaveBenefit.leaveBenefitsId,
                  remarks: '',
                },
                entityManager
              );

              const leaveCardLedgerCredit = await this.crudService.transact<LeaveCardLedgerCredit>(entityManager).create({
                dto: {
                  createdAt,
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
    return 'Monthly Leave Credit Earnings Addition executed';
  }
}
