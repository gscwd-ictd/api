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

type LeaveApplicationDateCandidate = {
  leaveApplicationDatesId: LeaveApplicationDates;
  leaveBenefitsId: string;
  employeeId: string;
};

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
    await this.addBackLeaveOnWorkSuspensionV3();
  }

  /**
   * Finds leave_application_dates rows eligible for add-back on a given date.
   * Only excludes rows already processed through the generic (non FL/SPL) path,
   * tracked via leave_add_back. Forced Leave / Special Privilege Leave duplicate
   * protection is handled separately in processSingleAddBack, since those two
   * paths never write to leave_add_back.
   */
  private async findEligibleLeaveApplicationDates(targetDate: Date): Promise<LeaveApplicationDateCandidate[]> {
    return (await this.rawQuery(
      `SELECT
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
            AND lb.leave_name <> 'Leave Without Pay'
            AND NOT EXISTS (
              SELECT 1 FROM leave_add_back lab
              WHERE lab.leave_application_dates_id_fk = lad.leave_application_date_id
            );`,
      [dayjs(targetDate).format('YYYY-MM-DD')]
    )) as LeaveApplicationDateCandidate[];
  }

  /**
   * Processes a single leave_application_dates candidate: resolves the employee's
   * schedule, computes credit values, and applies the correct add-back branch
   * (Special Privilege Leave, Forced Leave, or generic) with duplicate protection
   * scoped to each branch's actual bookkeeping table, since Forced Leave and
   * Special Privilege Leave never write to leave_add_back.
   */
  private async processSingleAddBack(candidate: LeaveApplicationDateCandidate, targetDate: Date) {
    const employeeSchedule = await this.employeeScheduleService.getEmployeeScheduleByDtrDateForLeaveAddback(candidate.employeeId, targetDate);

    const suspensionHrsForEmployee = await this.workSuspensionService.getWorkSuspensionHoursBySuspensionDateAndScheduleTimeOut(
      employeeSchedule.schedule.timeOut,
      targetDate
    );

    const workSuspensionStart = await this.workSuspensionService.getWorkSuspensionStart(employeeSchedule.schedule.timeOut, targetDate);
    const creditValue = suspensionHrsForEmployee / 8;
    const leaveApplicationDatesId = candidate.leaveApplicationDatesId;
    const remarks = 'Add Back | Work Suspension ' + workSuspensionStart;

    const leaveBenefitsId = await this.leaveBenefitsService.crud().findOne({
      find: {
        select: { id: true, leaveName: true },
        where: { id: candidate.leaveBenefitsId },
      },
    });

    if (!leaveBenefitsId) {
      throw new Error(`Leave benefits not found for id=${candidate.leaveBenefitsId} (employeeId=${candidate.employeeId})`);
    }

    if (leaveBenefitsId.leaveName === 'Special Privilege Leave') {
      const vlLeaveBenefits = await this.leaveBenefitsService.crud().findOne({
        find: {
          select: { id: true, leaveName: true },
          where: { leaveName: 'Vacation Leave' },
        },
      });

      if (!vlLeaveBenefits) {
        throw new Error(`Vacation Leave benefit type not found (employeeId=${candidate.employeeId})`);
      }

      const existingPrimaryCredit = await this.leaveCreditEarningsService.crud().findOneOrNull({
        find: {
          where: {
            employeeId: candidate.employeeId,
            leaveBenefitsId: { id: leaveBenefitsId.id },
            creditDate: targetDate,
            remarks,
          },
        },
      });

      const deductionRemarks = 'Deduction | Work Suspension ' + workSuspensionStart;
      const existingVlDebit = await this.leaveCreditDeductionsService.crud().findOneOrNull({
        find: {
          where: {
            employeeId: candidate.employeeId,
            leaveBenefitsId: { id: vlLeaveBenefits.id },
            remarks: deductionRemarks,
          },
        },
      });

      if (existingPrimaryCredit && existingVlDebit) {
        return { skipped: true, employeeId: candidate.employeeId, reason: 'Special Privilege Leave add-back already exists' };
      }

      const leaveCreditEarningId = await this.leaveCreditEarningsService.addLeaveCreditEarnings({
        leaveBenefitsId,
        creditDate: targetDate,
        creditValue: 1,
        remarks,
        employeeId: candidate.employeeId,
      });

      const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
        dto: { leaveCreditEarningId },
      });

      // Deduct the equivalent VL credit, since SPL add-back is drawn from the VL pool.
      // Clamp at 0 so an unexpectedly large suspensionHrs (e.g. multi-day) never flips
      // this into a positive credit instead of a debit.
      const debitValue = Math.max(0, 1 - Math.round((suspensionHrsForEmployee / 8) * 1000) / 1000);

      const leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
        dto: {
          leaveBenefitsId: vlLeaveBenefits,
          employeeId: candidate.employeeId,
          debitValue,
          remarks: deductionRemarks,
        },
      });

      const leaveCardLedgerDebit = await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
        debitValue,
        leaveCreditDeductionsId,
      });

      return { employeeId: candidate.employeeId, leaveCreditEarningId, leaveCardLedgerCredit, leaveCardLedgerDebit };
    } else if (leaveBenefitsId.leaveName === 'Forced Leave') {
      const vlLeaveBenefits = await this.leaveBenefitsService.crud().findOne({
        find: {
          select: { id: true, leaveName: true },
          where: { leaveName: 'Vacation Leave' },
        },
      });

      if (!vlLeaveBenefits) {
        throw new Error(`Vacation Leave benefit type not found (employeeId=${candidate.employeeId})`);
      }

      const existingPrimaryCredit = await this.leaveCreditEarningsService.crud().findOneOrNull({
        find: {
          where: {
            employeeId: candidate.employeeId,
            leaveBenefitsId: { id: leaveBenefitsId.id },
            creditDate: targetDate,
            remarks,
          },
        },
      });

      const existingVlCredit = await this.leaveCreditEarningsService.crud().findOneOrNull({
        find: {
          where: {
            employeeId: candidate.employeeId,
            leaveBenefitsId: { id: vlLeaveBenefits.id },
            creditDate: targetDate,
            remarks,
          },
        },
      });

      // Only skip when BOTH the Forced Leave credit and its paired Vacation Leave
      // credit already exist — a standalone VL add-back (from an unrelated VL
      // leave application) must not block this employee's FL add-back.
      if (existingPrimaryCredit && existingVlCredit) {
        return { skipped: true, employeeId: candidate.employeeId, reason: 'Forced Leave add-back already exists' };
      }

      const leaveCreditEarningIdFl = await this.leaveCreditEarningsService.addLeaveCreditEarnings({
        leaveBenefitsId,
        creditDate: targetDate,
        creditValue: 1,
        remarks,
        employeeId: candidate.employeeId,
      });

      const leaveCardLedgerCreditFl = await this.leaveCardLedgerCreditService.crud().create({
        dto: { leaveCreditEarningId: leaveCreditEarningIdFl },
      });

      const leaveCreditEarningIdVl = await this.leaveCreditEarningsService.addLeaveCreditEarnings({
        leaveBenefitsId: vlLeaveBenefits,
        creditDate: targetDate,
        creditValue,
        remarks,
        employeeId: candidate.employeeId,
      });

      const leaveCardLedgerCreditVl = await this.leaveCardLedgerCreditService.crud().create({
        dto: { leaveCreditEarningId: leaveCreditEarningIdVl },
      });

      return { employeeId: candidate.employeeId, leaveCreditEarningIdFl, leaveCreditEarningIdVl, leaveCardLedgerCreditFl, leaveCardLedgerCreditVl };
    } else {
      const addBack = await this.crudService.create({
        dto: {
          leaveApplicationDatesId,
          creditValue,
          reason: remarks,
        },
      });
      const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
        dto: { leaveAddBackId: addBack },
      });
      return { ...addBack, leaveCardLedgerCredit };
    }
  }

  /**
   * Runs add-back for a single target date: finds eligible leave_application_dates
   * and processes each independently (Promise.allSettled) so one employee's failure
   * (missing schedule, missing benefit lookup, etc.) never blocks add-back for the
   * rest of that day's employees.
   */
  private async runAddBackForDate(targetDate: Date) {
    const suspensionHrs = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(targetDate);

    if (suspensionHrs <= 0) {
      console.log('--------- Work Suspension CRON JOB not executed because there are no Work Suspension on this day-------------');
      return;
    }

    const leaveApplicationDates = await this.findEligibleLeaveApplicationDates(targetDate);

    if (leaveApplicationDates.length === 0) {
      console.log('--------- Work Suspension CRON JOB not executed because there are no Leave Application on this day-------------');
      return;
    }

    const results = await Promise.allSettled(leaveApplicationDates.map((candidate) => this.processSingleAddBack(candidate, targetDate)));

    results.forEach((r, idx) => {
      if (r.status === 'rejected') {
        console.error(
          `Add-back failed for leaveApplicationDatesId=${leaveApplicationDates[idx].leaveApplicationDatesId}, ` +
            `employeeId=${leaveApplicationDates[idx].employeeId}:`,
          r.reason
        );
      }
    });

    console.log('--------- Executed Work Suspension CRON JOB -------------');
    return results;
  }

  async addBackLeaveOnWorkSuspensionV3() {
    const latestWorkSuspensions = await this.workSuspensionService.getLatestWorkSuspensions();
    if (latestWorkSuspensions.length > 0) {
      await Promise.all(latestWorkSuspensions.map((ws) => this.runAddBackForDate(ws.suspensionDate)));
    }
  }

  async addBackLeaveOnWorkSuspensionV2() {
    const latestWorkSuspensions = await this.workSuspensionService.getLatestWorkSuspensions();
    if (latestWorkSuspensions.length > 0) {
      await Promise.all(
        latestWorkSuspensions.map(async (ws) => {
          const { suspensionDate } = ws;
          const suspensionHrs = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(suspensionDate);

          if (suspensionHrs > 0) {
            const leaveApplicationDates = (await this.rawQuery(
              `SELECT 
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
                    AND lb.leave_name <> 'Leave Without Pay' 
                    AND NOT EXISTS (
                      SELECT 1 FROM leave_add_back lab 
                      WHERE lab.leave_application_dates_id_fk = lad.leave_application_date_id
                    );`,
              [dayjs(suspensionDate).format('YYYY-MM-DD')]
            )) as { leaveApplicationDatesId: LeaveApplicationDates; leaveBenefitsId: string; employeeId: string }[];

            if (leaveApplicationDates.length !== 0) {
              const result = await Promise.all(
                leaveApplicationDates.map(async (_leaveApplicationDatesId) => {
                  const employeeSchedule = await this.employeeScheduleService.getEmployeeScheduleByDtrDateForLeaveAddback(
                    _leaveApplicationDatesId.employeeId,
                    suspensionDate
                  );

                  const suspensionHrs = await this.workSuspensionService.getWorkSuspensionHoursBySuspensionDateAndScheduleTimeOut(
                    employeeSchedule.schedule.timeOut,
                    suspensionDate
                  );

                  const workSuspensionStart = await this.workSuspensionService.getWorkSuspensionStart(
                    employeeSchedule.schedule.timeOut,
                    suspensionDate
                  );
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
                      creditDate: suspensionDate,
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
                      creditDate: suspensionDate,
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
                      creditDate: suspensionDate,
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
        })
      );
    }
  }

  async addBackLeaveOnWorkSuspension(dtrDate: Date) {
    await this.runAddBackForDate(dtrDate);
  }
}
