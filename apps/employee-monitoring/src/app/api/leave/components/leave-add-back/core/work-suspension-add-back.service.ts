import {
  LeaveAddBack,
  LeaveApplicationDates,
  LeaveBenefits,
  LeaveCardLedgerCredit,
  LeaveCardLedgerDebit,
  LeaveCreditDeductions,
  LeaveCreditEarnings,
  WorkSuspension,
  WorkSuspensionType,
} from '@gscwd-api/models';
import { Injectable, Logger } from '@nestjs/common';
import dayjs = require('dayjs');
import { DataSource, EntityManager, In } from 'typeorm';
import { EmployeeScheduleService } from '../../../../daily-time-record/components/employee-schedule/core/employee-schedule.service';
import { WorkSuspensionService } from '../../../../work-suspension/core/work-suspension.service';
import { getSuspensionWindow } from '../../../../work-suspension/core/work-suspension-window.util';
import {
  computeLeaveAddBack,
  HALF_DAY_PASS_SLIP_ADD_BACK,
  LEAVE_WITHOUT_PAY,
  SPECIAL_LEAVE_BENEFIT_TYPE,
  VACATION_LEAVE,
} from './work-suspension-add-back.util';

type LeaveCandidate = {
  leaveApplicationDateId: string;
  employeeId: string;
  leaveBenefitsId: string;
  leaveName: string;
  leaveTypes: string;
};

type PassSlipCandidate = { passSlipId: string; employeeId: string };

export type AddBackRunResult = { workSuspensionId: string; created: number; skipped: number; failed: number };

/**
 * Leave add-back for WHOLE_DAY / TIME_OF_DAY work suspensions (LEGACY rows stay in LeaveAddBackService).
 *
 * Every row written carries work_suspension_id_fk (+ add_back_source_id), which makes the run idempotent
 * (a source already credited for this suspension is skipped) and lets an edit/delete reverse exactly
 * what this suspension produced.
 */
@Injectable()
export class WorkSuspensionAddBackService {
  private readonly logger = new Logger(WorkSuspensionAddBackService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly workSuspensionService: WorkSuspensionService,
    private readonly employeeScheduleService: EmployeeScheduleService
  ) {}

  // ------------------------------------------------------------------ queries

  private async findLeaveCandidates(date: string): Promise<LeaveCandidate[]> {
    return await this.dataSource.query(
      `SELECT
          lad.leave_application_date_id leaveApplicationDateId,
          la.employee_id_fk employeeId,
          lb.leave_benefits_id leaveBenefitsId,
          lb.leave_name leaveName,
          lb.leave_types leaveTypes
        FROM leave_application_dates lad
          INNER JOIN leave_application la ON la.leave_application_id = lad.leave_application_id_fk
          INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
        WHERE lad.leave_date = ?
          AND la.status = 'approved'
          AND lad.status = 'approved'
          AND lb.leave_types <> ?
          AND lb.leave_name <> ?;`,
      [date, SPECIAL_LEAVE_BENEFIT_TYPE, LEAVE_WITHOUT_PAY]
    );
  }

  /**
   * Approved, not cancelled half-day pass slips on the date with complete logs: the pass slip time out
   * (actual or encoded) and the employee's DTR time in for that day.
   */
  private async findHalfDayPassSlipCandidates(date: string): Promise<PassSlipCandidate[]> {
    return await this.dataSource.query(
      `SELECT DISTINCT ps.pass_slip_id passSlipId, ps.employee_id_fk employeeId
        FROM pass_slip ps
          INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
          INNER JOIN ${process.env.HRMS_DB_NAME}employees emp ON emp._id = ps.employee_id_fk
          INNER JOIN daily_time_record dtr ON dtr.company_id_fk = emp.company_id AND dtr.dtr_date = ?
        WHERE DATE(ps.date_of_application) = ?
          AND ps.nature_of_business = 'Half Day'
          AND (ps.is_cancelled = 0 OR ps.is_cancelled IS NULL)
          AND psa.status = 'approved'
          AND COALESCE(ps.time_out, ps.encoded_time_out) IS NOT NULL
          AND dtr.time_in IS NOT NULL;`,
      [date, date]
    );
  }

  private async alreadyCredited(manager: EntityManager, workSuspensionId: string, sourceId: string, isLeaveAddBack: boolean): Promise<boolean> {
    const earnings = await manager.count(LeaveCreditEarnings, { where: { workSuspensionId, addBackSourceId: sourceId } });
    if (earnings > 0) return true;
    if (!isLeaveAddBack) return false;
    const addBacks = await manager.count(LeaveAddBack, { where: { workSuspensionId, leaveApplicationDatesId: { id: sourceId } } });
    return addBacks > 0;
  }

  private async vacationLeave(manager: EntityManager): Promise<LeaveBenefits> {
    const vl = await manager.findOne(LeaveBenefits, { where: { leaveName: VACATION_LEAVE } });
    if (!vl) throw new Error('Vacation Leave benefit type not found');
    return vl;
  }

  private async fractionFor(employeeId: string, suspension: WorkSuspension): Promise<number> {
    const { schedule } = await this.employeeScheduleService.getEmployeeScheduleByDtrDateForLeaveAddback(employeeId, dayjs(suspension.suspensionDate).toDate());
    if (!schedule?.timeIn || !schedule?.timeOut) return 0;
    return getSuspensionWindow(suspension, schedule).fraction;
  }

  // ------------------------------------------------------------------ writers

  private async creditEarning(
    manager: EntityManager,
    args: { employeeId: string; leaveBenefits: LeaveBenefits; date: string; value: number; remarks: string; workSuspensionId: string; sourceId: string }
  ) {
    const earning = await manager.save(
      manager.create(LeaveCreditEarnings, {
        employeeId: args.employeeId,
        leaveBenefitsId: args.leaveBenefits,
        creditDate: args.date as unknown as Date,
        creditValue: args.value,
        remarks: args.remarks,
        workSuspensionId: args.workSuspensionId,
        addBackSourceId: args.sourceId,
      })
    );
    await manager.save(manager.create(LeaveCardLedgerCredit, { leaveCreditEarningId: earning }));
  }

  private async debitDeduction(
    manager: EntityManager,
    args: { employeeId: string; leaveBenefits: LeaveBenefits; value: number; remarks: string; workSuspensionId: string; sourceId: string }
  ) {
    const deduction = await manager.save(
      manager.create(LeaveCreditDeductions, {
        employeeId: args.employeeId,
        leaveBenefitsId: args.leaveBenefits,
        debitValue: args.value,
        remarks: args.remarks,
        workSuspensionId: args.workSuspensionId,
        addBackSourceId: args.sourceId,
      })
    );
    await manager.save(manager.create(LeaveCardLedgerDebit, { leaveCreditDeductionsId: deduction, debitValue: args.value }));
  }

  private static remarks(suspension: WorkSuspension, kind: 'Add Back' | 'Deduction') {
    const when =
      suspension.suspensionType === WorkSuspensionType.WHOLE_DAY
        ? 'whole day'
        : `from ${dayjs(`2000-01-01 ${suspension.suspensionStartTime}`).format('hh:mm A')}`;
    return `${kind} | Work Suspension ${dayjs(suspension.suspensionDate).format('YYYY-MM-DD')} (${when})`;
  }

  private async processLeave(suspension: WorkSuspension, candidate: LeaveCandidate): Promise<'created' | 'skipped'> {
    const fraction = await this.fractionFor(candidate.employeeId, suspension);
    const entries = computeLeaveAddBack({ leaveName: candidate.leaveName, leaveTypes: candidate.leaveTypes }, suspension.suspensionType, fraction);
    if (entries.length === 0) return 'skipped';

    return await this.dataSource.transaction(async (manager) => {
      if (await this.alreadyCredited(manager, suspension.id, candidate.leaveApplicationDateId, true)) return 'skipped';

      const date = dayjs(suspension.suspensionDate).format('YYYY-MM-DD');
      const ownLeave = await manager.findOneOrFail(LeaveBenefits, { where: { id: candidate.leaveBenefitsId } });
      const isGeneric = entries.length === 1 && entries[0].leave === 'SAME' && entries[0].kind === 'credit';
      const addBackRemarks = WorkSuspensionAddBackService.remarks(suspension, 'Add Back');

      // VL / SL / other leaves keep using leave_add_back (credited to the leave's own type by the ledger)
      if (isGeneric && ownLeave.leaveName !== 'Special Privilege Leave' && ownLeave.leaveName !== 'Wellness Leave') {
        const addBack = await manager.save(
          manager.create(LeaveAddBack, {
            leaveApplicationDatesId: { id: candidate.leaveApplicationDateId } as LeaveApplicationDates,
            creditValue: entries[0].value,
            reason: addBackRemarks,
            workSuspensionId: suspension.id,
          })
        );
        await manager.save(manager.create(LeaveCardLedgerCredit, { leaveAddBackId: addBack }));
        return 'created';
      }

      const vl = entries.some((e) => e.leave === VACATION_LEAVE) ? await this.vacationLeave(manager) : null;
      for (const entry of entries) {
        const leaveBenefits = entry.leave === 'SAME' ? ownLeave : vl;
        const common = { employeeId: candidate.employeeId, leaveBenefits, value: entry.value, workSuspensionId: suspension.id, sourceId: candidate.leaveApplicationDateId };
        if (entry.kind === 'credit') await this.creditEarning(manager, { ...common, date, remarks: addBackRemarks });
        else await this.debitDeduction(manager, { ...common, remarks: WorkSuspensionAddBackService.remarks(suspension, 'Deduction') });
      }
      return 'created';
    });
  }

  private async processPassSlip(suspension: WorkSuspension, candidate: PassSlipCandidate): Promise<'created' | 'skipped'> {
    if ((await this.fractionFor(candidate.employeeId, suspension)) <= 0) return 'skipped';
    return await this.dataSource.transaction(async (manager) => {
      if (await this.alreadyCredited(manager, suspension.id, candidate.passSlipId, false)) return 'skipped';
      await this.creditEarning(manager, {
        employeeId: candidate.employeeId,
        leaveBenefits: await this.vacationLeave(manager),
        date: dayjs(suspension.suspensionDate).format('YYYY-MM-DD'),
        value: HALF_DAY_PASS_SLIP_ADD_BACK,
        remarks: WorkSuspensionAddBackService.remarks(suspension, 'Add Back') + ' | Half Day Pass Slip',
        workSuspensionId: suspension.id,
        sourceId: candidate.passSlipId,
      });
      return 'created';
    });
  }

  // ------------------------------------------------------------------ public API

  /** Credit everything a suspension should give. Safe to run repeatedly (cron + on create/edit). */
  async applyForSuspension(suspension: WorkSuspension | null): Promise<AddBackRunResult | null> {
    if (!suspension || suspension.isArchived || suspension.suspensionType === WorkSuspensionType.LEGACY) return null;
    const date = dayjs(suspension.suspensionDate).format('YYYY-MM-DD');
    const result: AddBackRunResult = { workSuspensionId: suspension.id, created: 0, skipped: 0, failed: 0 };

    const jobs: { label: string; run: () => Promise<'created' | 'skipped'> }[] = [
      ...(await this.findLeaveCandidates(date)).map((c) => ({ label: `leave date ${c.leaveApplicationDateId}`, run: () => this.processLeave(suspension, c) })),
      ...(await this.findHalfDayPassSlipCandidates(date)).map((c) => ({ label: `pass slip ${c.passSlipId}`, run: () => this.processPassSlip(suspension, c) })),
    ];

    // one employee's failure (missing schedule, ...) must not block the others
    const settled = await Promise.allSettled(jobs.map((job) => job.run()));
    settled.forEach((outcome, idx) => {
      if (outcome.status === 'fulfilled') result[outcome.value] += 1;
      else {
        result.failed += 1;
        this.logger.error(`Work suspension add-back failed for ${jobs[idx].label}: ${outcome.reason}`);
      }
    });
    return result;
  }

  /** Remove every credit/debit this suspension produced (before an edit is re-applied, or on delete). */
  async reverseForSuspension(workSuspensionId: string): Promise<{ addBacks: number; earnings: number; deductions: number }> {
    return await this.dataSource.transaction(async (manager) => {
      const addBacks = await manager.find(LeaveAddBack, { where: { workSuspensionId }, select: { id: true } });
      const earnings = await manager.find(LeaveCreditEarnings, { where: { workSuspensionId }, select: { id: true } });
      const deductions = await manager.find(LeaveCreditDeductions, { where: { workSuspensionId }, select: { id: true } });

      if (addBacks.length) {
        await manager.delete(LeaveCardLedgerCredit, { leaveAddBackId: { id: In(addBacks.map((r) => r.id)) } });
        await manager.delete(LeaveAddBack, { id: In(addBacks.map((r) => r.id)) });
      }
      if (earnings.length) {
        await manager.delete(LeaveCardLedgerCredit, { leaveCreditEarningId: { id: In(earnings.map((r) => r.id)) } });
        await manager.delete(LeaveCreditEarnings, { id: In(earnings.map((r) => r.id)) });
      }
      if (deductions.length) {
        await manager.delete(LeaveCardLedgerDebit, { leaveCreditDeductionsId: { id: In(deductions.map((r) => r.id)) } });
        await manager.delete(LeaveCreditDeductions, { id: In(deductions.map((r) => r.id)) });
      }
      return { addBacks: addBacks.length, earnings: earnings.length, deductions: deductions.length };
    });
  }

  /** Re-apply after an edit: reverse what the suspension gave, then credit again with the new values. */
  async reapplyForSuspension(workSuspensionId: string) {
    const reversed = await this.reverseForSuspension(workSuspensionId);
    const suspension = await this.workSuspensionService.getActiveWorkSuspensionById(workSuspensionId);
    const applied = await this.applyForSuspension(suspension);
    return { reversed, applied };
  }

  /** Cron: every new-rule suspension in the last 30 days (catches leaves / pass slips approved later). */
  async applyForRecentSuspensions() {
    const suspensions = await this.workSuspensionService.getRecentActiveSuspensions(30);
    const results: AddBackRunResult[] = [];
    for (const suspension of suspensions) {
      const result = await this.applyForSuspension(suspension);
      if (result) results.push(result);
    }
    return results;
  }
}
