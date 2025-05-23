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

  /**
   * @created 2025-04-30
   * @description SPL Forfeiture after 7 working days of january
   * @IMPORTANT During this was created, the period displayed on the ledger is hrmo_approval_date,
   * due to audit concerns this cannot be amended during the year,
   * so before the year ends (11:57-59pm), it should be amended to be hrdm_approval_date,
   * so that the carry over function of SPL to the next year will work accordingly with the forfeiture
   * for now, the logic flow of this function is assumingly in accordance to the amendment.
   */
  //TODO: During this was created, the period displayed on the ledger is hrmo_approval_date, due to audit concerns this cannot be amended during the year, so before the year ends (11:57-59pm), it should be amended to be hrdm_approval_date,
  @Cron('0 57 23 7-12 1 *')
  async forfeitureOfSpecialPrivilegeLeave() {
    try {
      const employees = await this.employeeService.getAllPermanentEmployeeIds();
      const now = dayjs().format('YYYY-MM-DD');
      const finalWorkingDay = dayjs(await this.holidaysService.getTheNextWorkingDayByDays(dayjs('2025-01-01').toDate(), 7)).format('YYYY-MM-DD');

      if (finalWorkingDay === now) {
        const result = await Promise.all(
          employees.map(async (employee) => {
            const { employeeId } = employee;

            const forfeitedSpl = parseInt(
              (
                await this.rawQuery(
                  `
                  SELECT COUNT(*) previousYearSplApplicationsValue
                  FROM leave_application la
                    INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id
                  WHERE employee_id_fk = ?
                  AND YEAR(hrdm_approval_date) = YEAR(NOW())
                  AND YEAR(date_of_filing) = YEAR(NOW())-1
                  AND la.status NOT IN ('disapproved by supervisor', 'disapproved by hrdm', 'disapproved by hrmo', 'cancelled')
                  AND lad.status in ('approved')
                  AND leave_benefits_id_fk = 'cb91fdda-9f65-4132-ae80-c61bda9abe31';
        `,
                  [employeeId]
                )
              )[0].previousYearSplApplicationsValue
            );
            if (forfeitedSpl > 0) {
              const splLeaveBenefit = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Special Privilege Leave' } } });
              const splDeduction = await this.leaveCreditDeductionService.crud().create({
                dto: {
                  leaveBenefitsId: splLeaveBenefit,
                  debitValue: forfeitedSpl,
                  employeeId,
                  remarks: 'SPL Forfeiture',
                },
              });

              const splLedger = await this.crud().create({
                dto: {
                  leaveCreditDeductionsId: splDeduction,
                  debitValue: forfeitedSpl,
                },
              });
            }
          })
        );
        console.log('SPL Forfeiture executed');
      }
    } catch (error) {
      console.log(error, '\nSPL Forfeiture failed');
    }
  }

  @Cron('0 57 23 5-10 12 *')
  async forfeitureOfForcedLeave() {
    const novemberLastWeekDay = await this.holidaysService.getLastWeekDayOfTheMonth(dayjs().format('YYYY') + '-11-30');
    const finalWorkingDay = await this.holidaysService.getTheNextWorkingDayByDays(dayjs(novemberLastWeekDay).toDate(), 5);
    const dayNow = dayjs().format('YYYY-MM-DD');
    if (dayjs(finalWorkingDay).format('YYYY-MM-DD') === dayNow) {
      const employees = await this.employeeService.getAllPermanentEmployeeIds();
      const result = await Promise.all(
        employees.map(async (employee) => {
          const { companyId, employeeId } = employee;
          const employeeLeaveLedger = (
            await this.rawQuery(`CALL sp_get_employee_ledger(?,?,?)`, [employeeId, companyId, dayjs().year()])
          )[0] as LeaveLedger[];

          const currentForcedLeaveBalance = employeeLeaveLedger[employeeLeaveLedger.length - 1].forcedLeaveBalance;
          const currentVLBalance = employeeLeaveLedger[employeeLeaveLedger.length - 1].vacationLeaveBalance;

          const forceLeaveBenefit = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Forced Leave' } } });
          const vacationLeaveBenefit = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Vacation Leave' } } });

          if (currentForcedLeaveBalance !== 0) {
            const flDeduction = await this.leaveCreditDeductionService.crud().create({
              dto: {
                leaveBenefitsId: forceLeaveBenefit,
                debitValue: currentForcedLeaveBalance,
                employeeId,
                remarks: 'FL Forfeiture',
              },
            });

            const flLedger = await this.crud().create({
              dto: {
                leaveCreditDeductionsId: flDeduction,
                debitValue: currentForcedLeaveBalance,
              },
            });

            const vlDeduction = await this.leaveCreditDeductionService.crud().create({
              dto: {
                leaveBenefitsId: vacationLeaveBenefit,
                debitValue: currentForcedLeaveBalance,
                employeeId,
                remarks: 'FL Forfeiture',
              },
            });

            const vlLedger = await this.crud().create({
              dto: {
                leaveCreditDeductionsId: vlDeduction,
                debitValue: currentForcedLeaveBalance,
              },
            });
          } else {
            console.log('0 fl here');
          }
        })
      );
      console.log('FL forfeiture executed.');
    }
  }
}
