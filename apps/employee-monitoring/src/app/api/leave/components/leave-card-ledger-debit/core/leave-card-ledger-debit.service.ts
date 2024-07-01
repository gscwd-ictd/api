import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveCardLedgerDebitDto, LeaveCardLedgerDebit } from '@gscwd-api/models';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../../../employees/core/employees.service';
import { Cron } from '@nestjs/schedule';
import { LeaveCreditDeductionsService } from '../../leave-credit-deductions/core/leave-credit-deductions.service';
import { LeaveLedger } from '@gscwd-api/utils';
import { LeaveBenefitsModule } from '../../leave-benefits/core/leave-benefits.module';
import { LeaveBenefitsService } from '../../leave-benefits/core/leave-benefits.service';

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
