import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveAddBackDto, LeaveAddBack, LeaveApplicationDates, LeaveBenefits } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs = require('dayjs');
import { EntityManager } from 'typeorm';
import { WorkSuspensionService } from '../../../../work-suspension/core/work-suspension.service';
import { LeaveCardLedgerCreditService } from '../../leave-card-ledger-credit/core/leave-card-ledger-credit.service';
import { LeaveCreditEarningsService } from '../../leave-credit-earnings/core/leave-credit-earnings.service';
import { LeaveBenefitsService } from '../../leave-benefits/core/leave-benefits.service';
import { LeaveCardLedgerDebitService } from '../../leave-card-ledger-debit/core/leave-card-ledger-debit.service';
import { LeaveCreditDeductionsService } from '../../leave-credit-deductions/core/leave-credit-deductions.service';
import { EmployeeScheduleService } from '../../../../daily-time-record/components/employee-schedule/core/employee-schedule.service';

@Injectable()
export class LeaveAddBackService extends CrudHelper<LeaveAddBack> {
  constructor(
    private readonly crudService: CrudService<LeaveAddBack>,
    private readonly workSuspensionService: WorkSuspensionService,
    private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService,
    private readonly leaveCreditEarningsService: LeaveCreditEarningsService,
    private readonly leaveBenefitsService: LeaveBenefitsService,
    private readonly leaveCreditDeductionsService: LeaveCreditDeductionsService,
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService,
    private readonly employeeScheduleService: EmployeeScheduleService
  ) {
    super(crudService);
  }

  async addLeaveAddBack(createLeaveAddBackDto: CreateLeaveAddBackDto) {
    const leaveAddBack = await this.crudService.create({ dto: createLeaveAddBackDto, onError: () => new InternalServerErrorException() });
    return leaveAddBack;
  }

  async addLeaveAddBackTransaction(createLeaveAddBackDto: CreateLeaveAddBackDto, entityManager: EntityManager) {
    const leaveAddBack = await this.crudService.transact<LeaveAddBack>(entityManager).create({
      dto: createLeaveAddBackDto,
      onError: () => new InternalServerErrorException(),
    });
    return leaveAddBack;
  }

  @Cron('0 59 23 * * 1-5')
  async scheduledAddBackLeaveOnWorkSuspension() {
    await this.addBackLeaveOnWorkSuspension(dayjs().toDate());
  }

  async addBackLeaveOnWorkSuspension(dtrDate: Date) {
    const suspensionHrs = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(dtrDate);

    if (suspensionHrs > 0) {
      const leaveApplicationDates = (await this.rawQuery(
        `
          SELECT 
            lad.leave_application_date_id leaveApplicationDatesId, 
            la.leave_benefits_id_fk leaveBenefitsId,
            la.employee_id_fk employeeId
          FROM leave_application_dates lad
            INNER JOIN leave_application la ON la.leave_application_id = lad.leave_application_id_fk
            INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
          WHERE lad.leave_date = ? 
          AND la.status = 'approved'
          AND lad.status = 'approved'
          AND lad.status <> 'for cancellation'
          AND lb.leave_types <> 'special leave benefit' 
          AND lb.leave_name <> 'Leave Without Pay';
      `,
        [dayjs(dtrDate).format('YYYY-MM-DD')]
      )) as { leaveApplicationDatesId: LeaveApplicationDates; leaveBenefitsId: string; employeeId: string }[];

      if (leaveApplicationDates.length !== 0) {
        const result = await Promise.all(
          leaveApplicationDates.map(async (_leaveApplicationDatesId) => {
            const employeeSchedule = await this.employeeScheduleService.getEmployeeScheduleByDtrDate(_leaveApplicationDatesId.employeeId, dtrDate);

            const suspensionHrs = await this.workSuspensionService.getWorkSuspensionHoursBySuspensionDateAndScheduleTimeOut(
              employeeSchedule.schedule.timeOut,
              dtrDate
            );

            const workSuspensionStart = await this.workSuspensionService.getWorkSuspensionStart(employeeSchedule.schedule.timeOut, dtrDate);
            const creditValue = suspensionHrs / 8;
            const leaveApplicationDatesId = _leaveApplicationDatesId.leaveApplicationDatesId;
            const leaveBenefitsId = await this.leaveBenefitsService.crud().findOne({
              find: {
                select: { id: true, leaveName: true },
                where: {
                  id: _leaveApplicationDatesId.leaveBenefitsId,
                },
              },
            });

            if (leaveBenefitsId.leaveName === 'Special Privilege Leave') {
              const leaveCreditEarningId = await this.leaveCreditEarningsService.addLeaveCreditEarnings({
                leaveBenefitsId,
                creditDate: dtrDate,
                creditValue: 1,
                remarks: 'Add Back | Work Suspension ' + workSuspensionStart,
                employeeId: _leaveApplicationDatesId.employeeId,
              });

              const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
                dto: { leaveCreditEarningId },
              });

              //then minus sa vl
              const VLleaveBenefitsId = await this.leaveBenefitsService.crud().findOne({
                find: {
                  select: { id: true, leaveName: true },
                  where: {
                    leaveName: 'Vacation Leave',
                  },
                },
              });
              const leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
                dto: {
                  leaveBenefitsId: VLleaveBenefitsId,
                  employeeId: _leaveApplicationDatesId.employeeId,
                  debitValue: 1 - Math.round((suspensionHrs / 8) * 1000) / 1000,
                  remarks: 'Deduction | Work Suspension ' + workSuspensionStart,
                },
              });

              const leaveCardLedgerDebit = await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
                debitValue: 1 - Math.round((suspensionHrs / 8) * 1000) / 1000,
                leaveCreditDeductionsId,
              });
            } else if (leaveBenefitsId.leaveName === 'Forced Leave') {
              const leaveCreditEarningIdFl = await this.leaveCreditEarningsService.addLeaveCreditEarnings({
                leaveBenefitsId,
                creditDate: dtrDate,
                creditValue: 1,
                remarks: 'Add Back | Work Suspension ' + workSuspensionStart,
                employeeId: _leaveApplicationDatesId.employeeId,
              });

              const leaveCardLedgerCreditFl = await this.leaveCardLedgerCreditService.crud().create({
                dto: { leaveCreditEarningId: leaveCreditEarningIdFl },
              });

              const leaveBenefitsIdVl = await this.leaveBenefitsService.crud().findOne({
                find: {
                  select: { id: true, leaveName: true },
                  where: {
                    leaveName: 'Vacation Leave',
                  },
                },
              });

              const leaveCreditEarningIdVl = await this.leaveCreditEarningsService.addLeaveCreditEarnings({
                leaveBenefitsId: leaveBenefitsIdVl,
                creditDate: dtrDate,
                creditValue,
                remarks: 'Add Back | Work Suspension ' + workSuspensionStart,
                employeeId: _leaveApplicationDatesId.employeeId,
              });

              const leaveCardLedgerCreditVl = await this.leaveCardLedgerCreditService.crud().create({
                dto: { leaveCreditEarningId: leaveCreditEarningIdVl },
              });
            } else {
              const addBack = await this.crudService.create({
                dto: {
                  leaveApplicationDatesId,
                  creditValue,
                  reason: 'Add Back | Work Suspension ' + workSuspensionStart,
                },
              });
              const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
                dto: { leaveAddBackId: addBack },
              });
              return { ...addBack, leaveCardLedgerCredit };
            }
          })
        );
        console.log('--------- Executed Work Suspension CRON JOB -------------');
      } else console.log('--------- Work Suspension CRON JOB not executed because there are no Leave Application on this day-------------');
    } else console.log('--------- Work Suspension CRON JOB not executed because there are no Work Suspension on this day-------------');
  }
}
