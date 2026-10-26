import { ExclusiveJob } from '../../../../../utils/exclusive-job.decorator';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveCardLedgerDebitDto, LeaveApplication, LeaveCardLedgerDebit } from '@gscwd-api/models';
import { forwardRef, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EmployeesService } from '../../../../employees/core/employees.service';
import { Cron } from '@nestjs/schedule';
import { LeaveCreditDeductionsService } from '../../leave-credit-deductions/core/leave-credit-deductions.service';
import { LeaveLedger } from '@gscwd-api/utils';
import { LeaveBenefitsModule } from '../../leave-benefits/core/leave-benefits.module';
import { LeaveBenefitsService } from '../../leave-benefits/core/leave-benefits.service';
import dayjs = require('dayjs');
import { create } from 'domain';
import { LeaveApplicationService } from '../../leave-application/core/leave-application.service';
import { HolidaysService } from '../../../../holidays/core/holidays.service';

@Injectable()
export class LeaveCardLedgerDebitService extends CrudHelper<LeaveCardLedgerDebit> {
  constructor(
    private readonly crudService: CrudService<LeaveCardLedgerDebit>,
    private readonly employeeService: EmployeesService,
    private readonly leaveCreditDeductionService: LeaveCreditDeductionsService,
    private readonly leaveBenefitsService: LeaveBenefitsService,
    @Inject(forwardRef(() => HolidaysService))
    private readonly holidaysService: HolidaysService
  ) {
    super(crudService);
  }

  async addLeaveCardLedgerDebit(leaveCardLedgerDto: CreateLeaveCardLedgerDebitDto) {
    //calculate debit value;
    return await this.crudService.create({
      dto: leaveCardLedgerDto,
      onError: () => new InternalServerErrorException(),
    });
  }

  async getDebitValue(id: string) {
    try {
      return (await this.rawQuery(`SELECT get_debit_value(?) debitValue;`, [id]))[0].debitValue;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async vlDeductionFromPreviouslyApprovedFLAdjustment() {
    const employeeIds = (await this.rawQuery(`SELECT distinct employee_id_fk employeeId FROM leave_application WHERE status='approved';`)) as {
      employeeId: string;
    }[];

    const flDeductions = (await this.rawQuery(`
      SELECT created_at createdAt,updated_at updatedAt, employee_id_fk employeeId, debit_value debitValue 
      FROM leave_credit_deductions WHERE leave_benefits_id_fk = '1c6bc9b6-af14-468d-88ad-5dfc01869608';`)) as {
      createdAt: Date;
      updatedAt: Date;
      employeeId: string;
      debitValue: number;
    }[];

    const vlDeductions = await Promise.all(
      flDeductions.map(async (flDeduction) => {
        const { createdAt, debitValue, employeeId } = flDeduction;
        //8ea199f1-73b8-4279-a5c8-9952a51a4b8c
        const leaveCreditDeductionsId = await this.leaveCreditDeductionService.crud().create({
          dto: {
            createdAt,
            updatedAt: createdAt,
            debitValue,
            employeeId,
            leaveBenefitsId: { id: '8ea199f1-73b8-4279-a5c8-9952a51a4b8c' },
            remarks: 'Deduction from Forced Leave Application',
          },
        });
        await this.addLeaveCardLedgerDebit({ leaveCreditDeductionsId, debitValue, createdAt });
      })
    );
  }

  async vlDeductionFromPreviouslyApprovedForceLeaveApplication() {
    const employeeIds = (await this.rawQuery(`SELECT distinct employee_id_fk employeeId FROM leave_application WHERE status='approved';`)) as {
      employeeId: string;
    }[];

    const vlDeductions = await Promise.all(
      employeeIds.map(async (employee) => {
        const { employeeId } = employee;
        //Deduction from Forced Leave
        const forcedLeaveApplications = (await this.rawQuery(
          `
            SELECT leave_application_id_fk leaveApplicationId, DATE_FORMAT(lcld.created_at,'%Y-%m-%d') createdAt,DATE_FORMAT(la.date_of_filing,'%Y-%m-%d 23:59:00') dateOfFiling,DATE_FORMAT(la.hrdm_approval_date,'%Y-%m-%d'
            ) hrdmApprovalDate,lcld.debit_value debitValue FROM leave_card_ledger_debit lcld 
              INNER JOIN leave_application la ON la.leave_application_id = lcld.leave_application_id_fk 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
            WHERE lb.leave_name = 'Forced Leave' AND la.employee_id_fk = ?;
        `,
          [employeeId]
        )) as { leaveApplicationId: string; createdAt: Date; debitValue: number; dateOfFiling: Date; hrdmApprovalDate: Date }[];

        if (forcedLeaveApplications.length > 0) {
          const details = await Promise.all(
            forcedLeaveApplications.map(async (fl) => {
              const { createdAt, leaveApplicationId, debitValue, dateOfFiling, hrdmApprovalDate } = fl;
              const vlAdjustmentFromForceLeaveCount = (
                await this.rawQuery(
                  `
              SELECT COUNT(leave_credit_deductions_id) vlAdjustmentFromForceLeaveCount 
                FROM leave_credit_deductions WHERE (DATE_FORMAT(created_at, '%Y-%m-%d') = ? OR DATE_FORMAT(created_at, '%Y-%m-%d') = ?) 
              AND employee_id_fk=? AND remarks = 'Deduction from Forced Leave';`,
                  [dayjs(dateOfFiling).format('YYYY-MM-DD'), dayjs(hrdmApprovalDate).add(1, 'D').format('YYYY-MM-DD'), employeeId]
                )
              )[0].vlAdjustmentFromForceLeaveCount;

              if (vlAdjustmentFromForceLeaveCount !== '0') {
                return { employeeId, createdAt, leaveApplicationId };
              } else {
                //insert adjustment;
                const leaveCreditDeductionsId = await this.leaveCreditDeductionService.crud().create({
                  dto: {
                    createdAt: dateOfFiling,
                    updatedAt: dateOfFiling,
                    debitValue,
                    employeeId,
                    leaveBenefitsId: { id: '8ea199f1-73b8-4279-a5c8-9952a51a4b8c' },
                    remarks: 'Deduction from Forced Leave',
                  },
                });
                await this.addLeaveCardLedgerDebit({ leaveCreditDeductionsId, debitValue, createdAt: dateOfFiling });
              }
            })
          );
          return details;
        }
      })
    );
    return vlDeductions;
  }

  // ---------------------------------------------------------------- forfeiture (HR 2026-10-22)
  //  - Forced Leave and Wellness Leave: expire 1 week after the last day of November (Dec 7, 23:57).
  //    Filing closes after Nov 30; the week is for pending approvals so balances do not go negative.
  //      unused FL -> deducted from Forced Leave AND Vacation Leave
  //      unused WL -> deducted from Wellness Leave
  //  - Special Privilege Leave: expires 1 week after the last day of December (Jan 7, 23:57).
  //    During that week the balance can exceed 3 (carry-over + the new year's 3); the excess is forfeited.

  static readonly FL_FORFEITURE_REMARKS = 'FL Forfeiture';
  static readonly WL_FORFEITURE_REMARKS = 'WL Forfeiture';
  static readonly SPL_FORFEITURE_REMARKS = 'SPL Forfeiture';

  /** Dec 7 = 1 week after Nov 30; Jan 7 = 1 week after Dec 31. */
  static forfeitureDate(kind: 'FL_WL' | 'SPL', year: number): string {
    return kind === 'FL_WL' ? `${year}-12-07` : `${year}-01-07`;
  }

  private static round3(value: number) {
    return Math.round((Number(value) + Number.EPSILON) * 1000) / 1000;
  }

  private async latestLedgerRow(employeeId: string, companyId: string, year: number): Promise<LeaveLedger | null> {
    const rows = (await this.rawQuery(`CALL sp_get_employee_ledger(?,?,?)`, [employeeId, companyId, year]))[0] as LeaveLedger[];
    return rows && rows.length > 0 ? rows[rows.length - 1] : null;
  }

  private async alreadyForfeited(employeeId: string, remarks: string, year: number): Promise<boolean> {
    const rows = (await this.rawQuery(
      `SELECT COUNT(*) cnt FROM leave_credit_deductions WHERE employee_id_fk = ? AND remarks = ? AND YEAR(created_at) = ?;`,
      [employeeId, remarks, year]
    )) as { cnt: string }[];
    return Number(rows[0].cnt) > 0;
  }

  private async addForfeitureDebit(employeeId: string, leaveName: string, value: number, remarks: string, createdAt: Date) {
    const leaveBenefitsId = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName } } });
    const leaveCreditDeductionsId = await this.leaveCreditDeductionService.crud().create({
      dto: { leaveBenefitsId, debitValue: value, employeeId, remarks, createdAt },
    });
    await this.crud().create({ dto: { leaveCreditDeductionsId, debitValue: value, createdAt } });
  }

  @Cron('0 57 23 7 12 *')
  @ExclusiveJob('leave-ledger-debit:forfeitureOfForcedAndWellnessLeave')
  async forfeitureOfForcedAndWellnessLeaveCron() {
    return await this.forfeitureOfForcedAndWellnessLeave(dayjs().year());
  }

  /** Forfeit the unused Forced Leave (FL + VL) and Wellness Leave (WL) of the year. Safe to re-run. */
  async forfeitureOfForcedAndWellnessLeave(year: number) {
    const employees = await this.employeeService.getAllActivePermanentEmployeeIds();
    const createdAt = dayjs(`${LeaveCardLedgerDebitService.forfeitureDate('FL_WL', year)} 23:57:00`).toDate();
    const result = { forcedLeave: 0, wellnessLeave: 0, failed: 0 };

    for (const { employeeId, companyId } of employees) {
      try {
        const last = await this.latestLedgerRow(employeeId, companyId, year);
        if (!last) continue;

        const fl = LeaveCardLedgerDebitService.round3(Number(last.forcedLeaveBalance) || 0);
        if (fl > 0 && !(await this.alreadyForfeited(employeeId, LeaveCardLedgerDebitService.FL_FORFEITURE_REMARKS, year))) {
          await this.addForfeitureDebit(employeeId, 'Forced Leave', fl, LeaveCardLedgerDebitService.FL_FORFEITURE_REMARKS, createdAt);
          await this.addForfeitureDebit(employeeId, 'Vacation Leave', fl, LeaveCardLedgerDebitService.FL_FORFEITURE_REMARKS, createdAt);
          result.forcedLeave++;
        }

        const wl = LeaveCardLedgerDebitService.round3(Number(last.wellnessLeaveBalance) || 0);
        if (wl > 0 && !(await this.alreadyForfeited(employeeId, LeaveCardLedgerDebitService.WL_FORFEITURE_REMARKS, year))) {
          await this.addForfeitureDebit(employeeId, 'Wellness Leave', wl, LeaveCardLedgerDebitService.WL_FORFEITURE_REMARKS, createdAt);
          result.wellnessLeave++;
        }
      } catch (error) {
        result.failed++;
        console.error(`[forfeiture] FL/WL failed for ${employeeId}:`, error);
      }
    }
    console.log(`FL/WL forfeiture ${year}:`, result);
    return result;
  }

  @Cron('0 57 23 7 1 *')
  @ExclusiveJob('leave-ledger-debit:forfeitureOfSpecialPrivilegeLeave')
  async forfeitureOfSpecialPrivilegeLeaveCron() {
    return await this.forfeitureOfSpecialPrivilegeLeave(dayjs().year());
  }

  /**
   * SPL of `year` should be 3 minus the SPL days filed in `year` that are already debited. Anything above
   * that on Jan 7 is the previous year's carry-over (left after late approvals of last year's SPL) and is
   * forfeited. Safe to re-run.
   */
  async forfeitureOfSpecialPrivilegeLeave(year: number) {
    const employees = await this.employeeService.getAllActivePermanentEmployeeIds();
    const createdAt = dayjs(`${LeaveCardLedgerDebitService.forfeitureDate('SPL', year)} 23:57:00`).toDate();
    const result = { forfeited: 0, failed: 0 };

    for (const { employeeId, companyId } of employees) {
      try {
        if (await this.alreadyForfeited(employeeId, LeaveCardLedgerDebitService.SPL_FORFEITURE_REMARKS, year)) continue;
        const last = await this.latestLedgerRow(employeeId, companyId, year);
        if (!last) continue;

        const balance = Number(last.specialPrivilegeLeaveBalance) || 0;
        const usedThisYear = Number(
          (
            await this.rawQuery(
              `SELECT COUNT(DISTINCT lad.leave_application_date_id) used
                 FROM leave_application la
                INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
                INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
                INNER JOIN leave_card_ledger_debit lcld ON lcld.leave_application_id_fk = la.leave_application_id
                WHERE la.employee_id_fk = ? AND lb.leave_name = 'Special Privilege Leave'
                  AND YEAR(la.date_of_filing) = ? AND la.status = 'approved' AND lad.status = 'approved';`,
              [employeeId, year]
            )
          )[0].used
        );
        const allowed = Math.max(0, 3 - usedThisYear);
        const excess = LeaveCardLedgerDebitService.round3(balance - allowed);
        if (excess > 0) {
          await this.addForfeitureDebit(employeeId, 'Special Privilege Leave', excess, LeaveCardLedgerDebitService.SPL_FORFEITURE_REMARKS, createdAt);
          result.forfeited++;
        }
      } catch (error) {
        result.failed++;
        console.error(`[forfeiture] SPL failed for ${employeeId}:`, error);
      }
    }
    console.log(`SPL forfeiture ${year}:`, result);
    return result;
  }
}
