import {
  LeaveApplicationDates,
  LeaveDateCancellationDto,
  UpdateLeaveApplicationEmployeeStatus,
  UpdateLeaveApplicationHrdmStatusDto,
  UpdateLeaveApplicationHrmoStatusDto,
  UpdateLeaveApplicationSupervisorStatusDto,
} from '@gscwd-api/models';
import { DtrDeductionType, LeaveApplicationStatus, LeaveLedger } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs = require('dayjs');
import { DataSource, EntityManager } from 'typeorm';
import { EmployeesService } from '../../employees/core/employees.service';
import { LeaveAddBackService } from '../components/leave-add-back/core/leave-add-back.service';
import { LeaveApplicationService } from '../components/leave-application/core/leave-application.service';
import { LeaveCardLedgerCreditService } from '../components/leave-card-ledger-credit/core/leave-card-ledger-credit.service';
import { LeaveCardLedgerDebitService } from '../components/leave-card-ledger-debit/core/leave-card-ledger-debit.service';
import { LeaveCreditDeductionsService } from '../components/leave-credit-deductions/core/leave-credit-deductions.service';
import { LeaveCreditEarningsService } from '../components/leave-credit-earnings/core/leave-credit-earnings.service';
import { LeaveAdjustmentDto } from '../data/leave-adjustment.dto';
import { LeaveApplicationDatesService } from '../components/leave-application-dates/core/leave-application-dates.service';
import { LeaveBenefitsService } from '../components/leave-benefits/core/leave-benefits.service';
import { LeaveMonetizationService } from '../components/leave-monetization/core/leave-monetization.service';

@Injectable()
export class LeaveService {
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService,
    private readonly leaveCardLedgerCreditService: LeaveCardLedgerCreditService,
    private readonly leaveCreditEarningsService: LeaveCreditEarningsService,
    private readonly leaveCreditDeductionsService: LeaveCreditDeductionsService,
    private readonly employeesService: EmployeesService,
    private readonly leaveAddBackService: LeaveAddBackService,
    private readonly leaveBenefitsService: LeaveBenefitsService,
    private readonly leaveApplicationDatesService: LeaveApplicationDatesService,
    private readonly leaveMonetizationService: LeaveMonetizationService,
    private readonly dataSource: DataSource
  ) {}

  async getLeavesUnderSupervisor(supervisorId: string) {
    return await this.leaveApplicationService.getLeavesUnderSupervisor(supervisorId);
  }

  async getLeavesUnderSupervisorV2(supervisorId: string) {
    return await this.leaveApplicationService.getAllLeavesUnderSupervisor(supervisorId);
  }

  async getLeavesForHrmoApproval() {
    return await this.leaveApplicationService.getLeavesByLeaveApplicationStatus(null);
  }

  async getLeavesForHrmoApprovalByYearMonth(yearMonth: string) {
    return await this.leaveApplicationService.getLeavesByYearMonth(yearMonth);
  }

  async getLeavesForHrdmApproval() {
    return await this.leaveApplicationService.getLeavesForHrdm();
  }

  async getLeavesForHrdmApprovalV2() {
    return await this.leaveApplicationService.getLeavesForHrdmV2();
  }

  async getLeaveLedger(employeeId: string, companyId: string, year: number) {
    const ledger = (
      await this.leaveApplicationService.crud().getRepository().query(`CALL sp_get_employee_ledger(?,?,?);`, [employeeId, companyId, year])
    )[0];
    return ledger;
  }

  async cancelLeaveDate(leaveDateCancellationDto: LeaveDateCancellationDto) {
    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      return await this.leaveApplicationDatesService.cancelLeaveDateTransaction(entityManager, leaveDateCancellationDto);
    });
    return result;
  }

  async updateLeaveStatus(
    updateLeaveApplicationStatusDto:
      | UpdateLeaveApplicationHrmoStatusDto
      | UpdateLeaveApplicationHrdmStatusDto
      | UpdateLeaveApplicationSupervisorStatusDto
  ) {
    const { id, status, ...rest } = updateLeaveApplicationStatusDto;
    const updateResult = await this.leaveApplicationService.crud().update({
      dto: { status, ...rest },
      updateBy: { id },
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    const leaveApplicationId = await this.leaveApplicationService.crud().findOne({
      find: {
        select: {
          abroad: true,
          id: true,
          dateOfFiling: true,
          employeeId: true,
          forBarBoardReview: true,
          referenceNo: true,
          forMastersCompletion: true,
          forMonetization: true,
          inHospital: true,
          inPhilippines: true,
          isTerminalLeave: true,
          outPatient: true,
          requestedCommutation: true,
          splWomen: true,
          status: true,
          studyLeaveOther: true,
          supervisorId: true,
          leaveBenefitsId: {
            id: true,
            leaveName: true,
            leaveType: true,
            accumulatedCredits: true,
            canBeCarriedOver: true,
            createdAt: true,
            creditDistribution: true,
            deletedAt: true,
            isMonetizable: true,
            maximumCredits: true,
            updatedAt: true,
          },
        },
        relations: { leaveBenefitsId: true },
        where: { id },
      },
    });

    if (updateResult.affected > 0) {
      if (status === LeaveApplicationStatus.APPROVED) {
        // if (leaveApplicationId.leaveBenefitsId.leaveName !== 'Leave Without Pay') {
        const debitValue = await this.leaveCardLedgerDebitService.getDebitValue(id);

        const { leaveName } = leaveApplicationId.leaveBenefitsId;

        const countLeaveLedgerDebit = await this.leaveCardLedgerDebitService
          .crud()
          .findOneOrNull({ find: { where: { leaveApplicationId: { id: leaveApplicationId.id } } } });

        if (countLeaveLedgerDebit === null) {
          const leaveCardLedgerDebit = await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
            leaveApplicationId,
            debitValue,
          });

          if (leaveName === 'Forced Leave') {
            //
            const leaveBenefitsId = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Vacation Leave' } } });
            const leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
              dto: {
                debitValue,
                createdAt: leaveApplicationId.dateOfFiling,
                leaveBenefitsId,
                remarks: 'Deduction from Forced Leave',
                employeeId: leaveApplicationId.employeeId,
              },
            });
            const leaveCardLedgerDebit = await this.leaveCardLedgerDebitService.crud().create({ dto: { leaveCreditDeductionsId, debitValue } });
          }

          if (leaveApplicationId.leaveBenefitsId.leaveType === 'special leave benefit') {
            const leaveCreditEarning = await this.leaveCreditEarningsService.addLeaveCreditEarnings({
              creditDate: dayjs().toDate(),
              creditValue: debitValue,
              dailyTimeRecordId: null,
              employeeId: leaveApplicationId.employeeId,
              leaveBenefitsId: leaveApplicationId.leaveBenefitsId,
              remarks: leaveApplicationId.leaveBenefitsId.leaveType,
            });
            const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
              dto: { leaveCreditEarningId: leaveCreditEarning },
            });
          }

          //!todo add condition for rehabilitation leave

          if (leaveName === 'Monetization' || leaveName === 'Terminal Leave') {
            //leaveApplicationId.

            let leaveCreditDeductionsId;
            const vlLeaveBenefitsId = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Vacation Leave' } } });
            const slLeaveBenefitsId = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Sick Leave' } } });
            const flLeaveBenefitsId = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Forced Leave' } } });
            const splLeaveBenefitsId = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Special Privilege Leave' } } });
            const monetizationDetails = await this.leaveMonetizationService.crud().findOne({
              find: {
                select: { convertedSl: true, convertedVl: true, id: true, leaveApplicationId: { id: true }, monetizedAmount: true },
                where: { leaveApplicationId: { id: leaveApplicationId.id } },
              },
            });

            const { convertedSl, convertedVl, monetizedAmount } = monetizationDetails;

            if (leaveName === 'Terminal Leave') {
              const companyId = await this.employeesService.getCompanyId(leaveApplicationId.employeeId);
              const employeeLeaveLedger = (
                await this.leaveApplicationService.rawQuery(`CALL sp_get_employee_ledger(?,?,?)`, [
                  leaveApplicationId.employeeId,
                  companyId,
                  dayjs().year(),
                ])
              )[0] as LeaveLedger[];
              const finalBalance = employeeLeaveLedger[employeeLeaveLedger.length - 1];
              const { vacationLeaveBalance, sickLeaveBalance, forcedLeaveBalance, specialPrivilegeLeaveBalance } = finalBalance;
              const vlExcessLeaveCreditEarning = await this.leaveCreditEarningsService.crud().create({
                dto: {
                  creditValue: parseFloat(convertedVl.toString()) - parseFloat(vacationLeaveBalance.toString()),
                  leaveBenefitsId: vlLeaveBenefitsId,
                  employeeId: leaveApplicationId.employeeId,
                  creditDate: dayjs().toDate(),
                  remarks: 'VL Credit Earnings for the Month prior Terminal Leave',
                },
              });

              const vlLeaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
                dto: { leaveCreditEarningId: vlExcessLeaveCreditEarning },
              });

              const slExcessLeaveCreditEarning = await this.leaveCreditEarningsService.crud().create({
                dto: {
                  creditValue: parseFloat(convertedSl.toString()) - parseFloat(sickLeaveBalance.toString()),
                  leaveBenefitsId: slLeaveBenefitsId,
                  remarks: 'SL Credit Earnings for the Month prior Terminal Leave',
                  employeeId: leaveApplicationId.employeeId,
                  creditDate: dayjs().toDate(),
                },
              });

              const slLeaveCardLedgerCredit = await this.leaveCardLedgerCreditService.crud().create({
                dto: { leaveCreditEarningId: slExcessLeaveCreditEarning },
              });

              //zero out fl and spl
              if (parseFloat(forcedLeaveBalance.toString()) > 0) {
                leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
                  dto: {
                    debitValue: parseFloat(forcedLeaveBalance.toString()),
                    createdAt: leaveApplicationId.dateOfFiling,
                    leaveBenefitsId: flLeaveBenefitsId,
                    remarks: `FL deduction from Terminal Leave`,
                    employeeId: leaveApplicationId.employeeId,
                  },
                });
                const flLeaveCardLedgerDebit = await this.leaveCardLedgerDebitService
                  .crud()
                  .create({ dto: { leaveCreditDeductionsId, debitValue: parseFloat(forcedLeaveBalance.toString()) } });
              }

              if (parseFloat(specialPrivilegeLeaveBalance.toString()) > 0) {
                leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
                  dto: {
                    debitValue: parseFloat(specialPrivilegeLeaveBalance.toString()),
                    createdAt: leaveApplicationId.dateOfFiling,
                    leaveBenefitsId: splLeaveBenefitsId,
                    remarks: `SPL deduction from Terminal Leave`,
                    employeeId: leaveApplicationId.employeeId,
                  },
                });
                const splLeaveCardLedgerDebit = await this.leaveCardLedgerDebitService
                  .crud()
                  .create({ dto: { leaveCreditDeductionsId, debitValue: parseFloat(specialPrivilegeLeaveBalance.toString()) } });
              }
            }

            leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
              dto: {
                debitValue: convertedVl,
                createdAt: leaveApplicationId.dateOfFiling,
                leaveBenefitsId: vlLeaveBenefitsId,
                remarks:
                  leaveName === 'Monetization'
                    ? `VL deduction from monetization | ` + leaveApplicationId.referenceNo
                    : `VL deduction from Terminal Leave` +
                      ` (` +
                      dayjs(leaveApplicationId.dateOfFiling).format('YYYY-MM-DD') +
                      `/₱ ` +
                      monetizedAmount +
                      `)`,
                employeeId: leaveApplicationId.employeeId,
              },
            });
            const vlLeaveCardLedgerDebit = await this.leaveCardLedgerDebitService
              .crud()
              .create({ dto: { leaveCreditDeductionsId, debitValue: convertedVl } });

            leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
              dto: {
                debitValue: convertedSl,
                createdAt: leaveApplicationId.dateOfFiling,
                leaveBenefitsId: slLeaveBenefitsId,
                remarks:
                  leaveName === 'Monetization'
                    ? `SL deduction from monetization | ` + leaveApplicationId.referenceNo
                    : `SL deduction from Terminal Leave` +
                      ` (` +
                      dayjs(leaveApplicationId.dateOfFiling).format('YYYY-MM-DD') +
                      `/₱ ` +
                      monetizedAmount +
                      `)`,
                employeeId: leaveApplicationId.employeeId,
              },
            });
            const slLeaveCardLedgerDebit = await this.leaveCardLedgerDebitService
              .crud()
              .create({ dto: { leaveCreditDeductionsId, debitValue: convertedSl } });
          }
          //}
        }
      }
      return await this.leaveApplicationService.getLeaveApplicationDetails(id, leaveApplicationId.employeeId);
    }
  }

  async cancelLeave(updateLeaveApplicationEmployeeStatus: UpdateLeaveApplicationEmployeeStatus) {
    const { id, ...rest } = updateLeaveApplicationEmployeeStatus;

    const leaveApplication = await this.leaveApplicationService.crud().findOne({ find: { select: { id: true, status: true }, where: { id } } });

    const cancelLeave = await this.leaveApplicationService.crud().update({
      dto: { status: LeaveApplicationStatus.CANCELLED, cancelDate: dayjs().toDate(), ...rest },
      updateBy: { id },
      onError: () => new InternalServerErrorException(),
    });

    if (leaveApplication.status === 'approved') {
      //credit value= number of days of leave
      const leaveApplicationDates = (await this.leaveApplicationService.rawQuery(
        `SELECT leave_application_date_id id, leave_date leaveDate FROM leave_application_dates 
        WHERE leave_date NOT IN (SELECT holiday_date FROM holidays) AND leave_application_id_fk = ?;`,
        [leaveApplication.id]
      )) as LeaveApplicationDates[];

      const leaveName = leaveApplication.leaveBenefitsId.leaveName;

      await Promise.all(
        leaveApplicationDates.map(async (leaveApplicationDate) => {
          const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
            const reason = 'Cancelled Leave - ' + dayjs(leaveApplicationDate.leaveDate).format('YYYY-MM-DD');

            const leaveAddBack = await this.leaveAddBackService.addLeaveAddBackTransaction(
              {
                creditValue: leaveName !== 'Leave Without Pay' ? 1 : 0,
                leaveApplicationDatesId: leaveApplicationDate,
                reason,
              },
              entityManager
            );

            const leaveCardLedgerCredit = await this.leaveCardLedgerCreditService.addLeaveCardLedgerCreditTransaction(
              {
                leaveAddBackId: leaveAddBack,
              },
              entityManager
            );
            if (leaveName === 'Forced Leave') {
              const vl = await this.leaveBenefitsService.crud().findOne({ find: { where: { leaveName: 'Vacation Leave' } } });
              const leaveCreditEarningId = await this.leaveCreditEarningsService.crud().create({
                dto: {
                  creditValue: 1,
                  leaveBenefitsId: vl,
                  employeeId: leaveApplication.employeeId,
                  remarks: 'Add Back due to Leave Cancellation',
                },
              });
              const leaveCardLedgerItem = await this.leaveCardLedgerCreditService.addLeaveCardLedgerCreditTransaction(
                {
                  leaveCreditEarningId,
                },
                entityManager
              );
            }
          });
        })
      );
    }
    return updateLeaveApplicationEmployeeStatus;
  }

  async addAdjustment(leaveAdjustmentDto: LeaveAdjustmentDto) {
    //
    const { category, leaveBenefitsId, remarks, value, employeeId } = leaveAdjustmentDto;
    let adjustment;
    if (category === 'debit') {
      const leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
        dto: {
          debitValue: value,
          remarks,
          leaveBenefitsId,
          employeeId,
        },
      });
      adjustment = await this.leaveCardLedgerDebitService.crud().create({
        dto: {
          leaveCreditDeductionsId,
          debitValue: value,
        },
        onError: () => new InternalServerErrorException(),
      });

      if (leaveBenefitsId.toString() === '1c6bc9b6-af14-468d-88ad-5dfc01869608') {
        const leaveCreditDeductionsId = await this.leaveCreditDeductionsService.crud().create({
          dto: {
            debitValue: value,
            remarks: 'Deduction from Forced Leave adjustment',
            leaveBenefitsId: { id: '8ea199f1-73b8-4279-a5c8-9952a51a4b8c' },
            employeeId,
          },
        });
        adjustment = await this.leaveCardLedgerDebitService.crud().create({
          dto: {
            leaveCreditDeductionsId,
            debitValue: value,
          },
          onError: () => new InternalServerErrorException(),
        });
      }
    } else if (category === 'credit') {
      const leaveCreditEarningId = await this.leaveCreditEarningsService
        .crud()
        .create({ dto: { creditDate: dayjs().toDate(), creditValue: value, leaveBenefitsId, employeeId, remarks } });
      adjustment = await this.leaveCardLedgerCreditService.crud().create({
        dto: { leaveCreditEarningId },
        onError: () => new InternalServerErrorException(),
      });
    }
    return adjustment;
  }

  async getForHrdmApprovalCount() {
    return parseInt(
      (await this.leaveApplicationService.rawQuery(`SELECT count(*) forHrdmCount FROM leave_application WHERE status = 'for hrdm approval';`))[0]
        .forHrdmCount
    );
  }
}
