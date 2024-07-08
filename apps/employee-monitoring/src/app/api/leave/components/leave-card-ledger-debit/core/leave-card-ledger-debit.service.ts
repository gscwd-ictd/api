import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveCardLedgerDebitDto, LeaveCardLedgerDebit } from '@gscwd-api/models';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../../../employees/core/employees.service';
import { Cron } from '@nestjs/schedule';
import { LeaveCreditDeductionsService } from '../../leave-credit-deductions/core/leave-credit-deductions.service';
import { LeaveLedger } from '@gscwd-api/utils';
import { LeaveBenefitsModule } from '../../leave-benefits/core/leave-benefits.module';
import { LeaveBenefitsService } from '../../leave-benefits/core/leave-benefits.service';
import dayjs = require('dayjs');
import { create } from 'domain';

@Injectable()
export class LeaveCardLedgerDebitService extends CrudHelper<LeaveCardLedgerDebit> {
  constructor(
    private readonly crudService: CrudService<LeaveCardLedgerDebit>,
    private readonly employeeService: EmployeesService,
    private readonly leaveCreditDeductionService: LeaveCreditDeductionsService,
    private readonly leaveBenefitsService: LeaveBenefitsService
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
      throw new HttpException(error.message, error.status);
    }
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
            SELECT leave_application_id_fk leaveApplicationId, DATE_FORMAT(lcld.created_at,'%Y-%m-%d') createdAt,DATE_FORMAT(la.date_of_filing,'%Y-%m-%d 23:59:00') dateOfFiling,lcld.debit_value debitValue FROM leave_card_ledger_debit lcld 
              INNER JOIN leave_application la ON la.leave_application_id = lcld.leave_application_id_fk 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
            WHERE lb.leave_name = 'Forced Leave' AND la.employee_id_fk = ?;
        `,
          [employeeId]
        )) as { leaveApplicationId: string; createdAt: Date; debitValue: number; dateOfFiling: Date }[];

        if (forcedLeaveApplications.length > 0) {
          const details = await Promise.all(
            forcedLeaveApplications.map(async (fl) => {
              const { createdAt, leaveApplicationId, debitValue, dateOfFiling } = fl;
              const vlAdjustmentFromForceLeaveCount = (
                await this.rawQuery(
                  `
              SELECT COUNT(leave_credit_deductions_id) vlAdjustmentFromForceLeaveCount 
                FROM leave_credit_deductions WHERE DATE_FORMAT(created_at, '%Y-%m-%d') = ? 
              AND employee_id_fk=? AND remarks = 'Deduction from Forced Leave';`,
                  [dayjs(dateOfFiling).format('YYYY-MM-DD'), employeeId]
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

  @Cron('0 57 23 30 10 *')
  async forfeitureOfForcedLeave() {
    const employees = await this.employeeService.getAllPermanentEmployeeIds();
    const result = await Promise.all(
      employees.map(async (employee) => {
        const { companyId, employeeId } = employee;
        const employeeLeaveLedger = (await this.rawQuery(`CALL sp_generate_leave_ledger_view(?,?)`, [employeeId, companyId]))[0] as LeaveLedger[];

        const currentForcedLeaveBalance = employeeLeaveLedger[employeeLeaveLedger.length - 1].forcedLeaveBalance;
        const currentVLBalance = employeeLeaveLedger[employeeLeaveLedger.length - 1].vacationLeaveBalance;

        const forceLeaveBenefit = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Forced Leave' } } });
        const vacationLeaveBenefit = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Vacation Leave' } } });
        //fl 2 vl 10
        //if (currentForcedLeaveBalance < currentVLBalance && currentVLBalance > 0) {
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
        //}

        // if (currentForcedLeaveBalance < currentVLBalance && currentVLBalance < 0) {
        //   const flDeduction = await this.leaveCreditDeductionService.crud().create({
        //     dto: {
        //       leaveBenefitsId: forceLeaveBenefit,
        //       debitValue: currentForcedLeaveBalance,
        //       employeeId,
        //       remarks: 'FL Forfeiture',
        //     },
        //   });

        //   const flLedger = await this.crud().create({
        //     dto: {
        //       leaveCreditDeductionsId: flDeduction,
        //       debitValue: currentForcedLeaveBalance,
        //     },
        //   });
        // }

        // // if (currentForcedLeaveBalance < currentVLBalance && currentVLBalance > 0) {
        // //   const flDeduction = await this.leaveCreditDeductionService.crud().create({
        // //     dto: {
        // //       leaveBenefitsId: forceLeaveBenefit,
        // //       debitValue: currentForcedLeaveBalance,
        // //       employeeId,
        // //       remarks: 'FL Forfeiture',
        // //     },
        // //   });

        // //   const flLedger = await this.crud().create({
        // //     dto: {
        // //       leaveCreditDeductionsId: flDeduction,
        // //       debitValue: currentForcedLeaveBalance,
        // //     },
        // //   });
        // // }
        // if (currentForcedLeaveBalance > currentVLBalance && currentVLBalance < 0) {
        //   const flDeduction = await this.leaveCreditDeductionService.crud().create({
        //     dto: {
        //       leaveBenefitsId: forceLeaveBenefit,
        //       debitValue: currentForcedLeaveBalance,
        //       employeeId,
        //       remarks: 'FL Forfeiture',
        //     },
        //   });

        //   const flLedger = await this.crud().create({
        //     dto: {
        //       leaveCreditDeductionsId: flDeduction,
        //       debitValue: currentForcedLeaveBalance,
        //     },
        //   });
        // }
        // //fl 3 vl 2
        // if (currentForcedLeaveBalance > currentVLBalance && currentVLBalance > 0) {
        //   const flDeduction = await this.leaveCreditDeductionService.crud().create({
        //     dto: {
        //       leaveBenefitsId: forceLeaveBenefit,
        //       debitValue: currentForcedLeaveBalance,
        //       employeeId,
        //       remarks: 'FL Forfeiture',
        //     },
        //   });

        //   const flLedger = await this.crud().create({
        //     dto: {
        //       leaveCreditDeductionsId: flDeduction,
        //       debitValue: currentForcedLeaveBalance,
        //     },
        //   });

        //   const vlDeduction = await this.leaveCreditDeductionService.crud().create({
        //     dto: {
        //       leaveBenefitsId: vacationLeaveBenefit,
        //       debitValue: currentVLBalance,
        //       employeeId,
        //       remarks: 'FL Forfeiture',
        //     },
        //   });

        //   const vlLedger = await this.crud().create({
        //     dto: {
        //       leaveCreditDeductionsId: vlDeduction,
        //       debitValue: currentVLBalance,
        //     },
        //   });
        // }
      })
    );
    console.log('FL forfeited.');
  }
}
