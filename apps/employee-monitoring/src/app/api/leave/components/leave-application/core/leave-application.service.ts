import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveApplicationDto, LeaveApplicationDates, LeaveBenefits, UpdateLeaveApplicationDto } from '@gscwd-api/models';
import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LeaveApplication } from '@gscwd-api/models';
import {
  HrmoLeaveApplicationListItem,
  LeaveApplicationStatus,
  LeaveApplicationType,
  LeaveDayStatus,
  LeaveLedger,
  MonetizationType,
  SickLeaveDetails,
  StudyLeaveDetails,
  VacationLeaveDetails,
} from '@gscwd-api/utils';
import { RpcException } from '@nestjs/microservices';
import { Between, DataSource, EntityManager } from 'typeorm';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { isArray } from 'class-validator';
import { LeaveApplicationDatesService } from '../../leave-application-dates/core/leave-application-dates.service';
import dayjs = require('dayjs');
import { EmployeesService } from '../../../../employees/core/employees.service';
import { OfficerOfTheDayService } from '../../../../officer-of-the-day/core/officer-of-the-day.service';
import { LeaveMonetizationService } from '../../leave-monetization/core/leave-monetization.service';

@Injectable()
export class LeaveApplicationService extends CrudHelper<LeaveApplication> {
  constructor(
    private readonly crudService: CrudService<LeaveApplication>,
    private readonly dataSource: DataSource,
    private readonly client: MicroserviceClient,
    private readonly leaveApplicationDatesService: LeaveApplicationDatesService,
    private readonly employeesService: EmployeesService,
    private readonly leaveMonetizationService: LeaveMonetizationService
  ) {
    super(crudService);
  }

  async createLeaveApplicationTransaction(transactionEntityManager: EntityManager, createLeaveApplicationDto: CreateLeaveApplicationDto) {
    const { leaveApplicationDates, ...rest } = createLeaveApplicationDto;
    const referenceNo = (await this.rawQuery(`SELECT generate_leave_application_reference_number() referenceNo;`))[0].referenceNo;
    return await this.crudService.transact<LeaveApplication>(transactionEntityManager).create({
      dto: { ...rest, referenceNo },
      onError: ({ error }) => {
        console.log('createLeaveApplicationTransaction', error);
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async createLeaveApplication(createLeaveApplication: CreateLeaveApplicationDto) {
    const { leaveBenefitId, employeeId } = createLeaveApplication;

    // const pendingSameLeaveType = await this.crud().findOneOrNull({
    //   find: {
    //     where: [
    //       { leaveBenefitsId: leaveBenefitId, status: LeaveApplicationStatus.FOR_HRDM_APPROVAL, employeeId },
    //       { leaveBenefitsId: leaveBenefitId, status: LeaveApplicationStatus.FOR_HRMO_CREDIT_CERTIFICATION, employeeId },
    //       { leaveBenefitsId: leaveBenefitId, status: LeaveApplicationStatus.FOR_SUPERVISOR_APPROVAL, employeeId }
    //     ]
    //   }
    // });

    // console.log('test create leave: ', pendingSameLeaveType);
    // if (pendingSameLeaveType !== null)
    //   throw new ForbiddenException("You still have a pending Leave Application of the same Leave Type");
    // console.log('Leave Application: ', pendingSameLeaveType);

    const monthNow = new Date(Date.now()).getMonth() + 1;
    const now =
      new Date(Date.now()).getFullYear().toString() +
      '-' +
      monthNow.toString() +
      '-' +
      new Date(Date.now()).getDate().toString() +
      ' ' +
      new Date(Date.now()).getHours().toString() +
      ':' +
      new Date(Date.now()).getMinutes().toString() +
      ':' +
      new Date(Date.now()).getSeconds().toString();

    const result = this.dataSource.transaction(async (transactionEntityManager) => {
      const { leaveApplicationDates, ...rest } = createLeaveApplication;

      const companyId = await this.employeesService.getCompanyId(rest.employeeId);
      let supervisorId = null;

      /* UNCOMMENT IF rules change again regarding officer of the day approval
      const employeeAssignmentId = (await this.employeesService.getEmployeeDetails(rest.employeeId)).assignment.id;

      supervisorId = await this.officerOfTheDayService.getOfficerOfTheDayOrgByOrgId(employeeAssignmentId);
      */

      //supervisorId of hrd manager for gm leave application;
      const employeePosition = (await this.employeesService.getEmployeeDetails(rest.employeeId)).assignment.positionTitle;

      if (employeePosition === 'OIC-General Manager' || employeePosition === 'General Manager A')
        supervisorId = await this.employeesService.getHrdManagerId();

      if (supervisorId === null) {
        supervisorId = (await this.client.call<string, string, string>({
          action: 'send',
          payload: rest.employeeId,
          pattern: 'get_employee_supervisor_id',
          onError: (error) => new NotFoundException(error),
        })) as string;
      }

      const leaveApplication = await this.createLeaveApplicationTransaction(transactionEntityManager, {
        ...rest,
        supervisorId,
        dateOfFiling: new Date(now),
        status: LeaveApplicationStatus.FOR_HRMO_CREDIT_CERTIFICATION,
        forMonetization: typeof rest.leaveMonetization === 'undefined' ? false : true,
        leaveApplicationDates,
      });

      let leaveApplicationDatesResult;

      if (isArray(leaveApplicationDates)) {
        leaveApplicationDatesResult = await Promise.all(
          leaveApplicationDates.map(async (leaveDate) => {
            return await this.leaveApplicationDatesService.createApplicationDatesTransaction(transactionEntityManager, {
              leaveDate,
              leaveApplicationId: leaveApplication,
            });
          })
        );

        const leaveName = (
          await this.rawQuery(`SELECT leave_name leaveName FROM leave_benefits WHERE leave_benefits_id = ?`, [leaveApplication.leaveBenefitsId])
        )[0].leaveName;
        if (leaveName === 'Terminal Leave') {
          const terminalLeaveDay = leaveApplicationDates[0];
          const salaryGradeAmount = (await this.employeesService.getSalaryGradeOrDailyRateByEmployeeId(rest.employeeId)).salaryGradeAmount;

          const excessDates = parseInt(dayjs(terminalLeaveDay).format('DD'));
          const { dailyLeaveCredit, monetizationConstant } = (
            await this.rawQuery(
              `SELECT (SELECT value FROM ems_settings WHERE name= 'daily_leave_credit') dailyLeaveCredit, (SELECT value FROM ems_settings WHERE name= 'monetization_constant') monetizationConstant;`
            )
          )[0] as { dailyLeaveCredit: number; monetizationConstant: number };

          const excessCreditEarnings = Math.round(excessDates * dailyLeaveCredit * 1000) / 1000;
          const employeeLeaveLedger = (
            await this.rawQuery(`CALL sp_get_employee_ledger(?,?,?)`, [rest.employeeId, companyId, dayjs().year()])
          )[0] as LeaveLedger[];
          const finalBalance = employeeLeaveLedger[employeeLeaveLedger.length - 1];

          const monetizedAmount: number =
            Math.trunc(
              (parseFloat(finalBalance.vacationLeaveBalance.toString()) +
                excessCreditEarnings +
                (parseFloat(finalBalance.sickLeaveBalance.toString()) + excessCreditEarnings)) *
                (salaryGradeAmount * monetizationConstant) *
                1000
            ) / 1000;

          const leaveMonetization = await this.leaveMonetizationService.createLeaveMonetization(
            transactionEntityManager,
            {
              convertedSl: excessCreditEarnings + parseFloat(finalBalance.sickLeaveBalance.toString()),
              convertedVl: excessCreditEarnings + parseFloat(finalBalance.vacationLeaveBalance.toString()),
              monetizationType: MonetizationType.TERMINAL,
              monetizedAmount: Math.trunc(monetizedAmount * 100) / 100,
            },
            leaveApplication
          );
        }
      } else {
        if (leaveApplicationDates !== null) {
          const { from, to } = leaveApplicationDates;
          leaveApplicationDatesResult = (
            await transactionEntityManager.query(`CALL sp_generate_date_range(?,?,?,?);`, [
              leaveApplication.employeeId,
              leaveApplication.id,
              from,
              to,
            ])
          )[0];
        } else {
          const {
            leaveMonetization: { convertedSl, convertedVl, monetizationType, monetizedAmount },
          } = rest;

          const leaveMonetization = await this.leaveMonetizationService.createLeaveMonetization(
            transactionEntityManager,
            { convertedSl, convertedVl, monetizationType, monetizedAmount },
            leaveApplication
          );
        }
      }
      return {
        leaveApplication,
        leaveApplicationDates: leaveApplicationDatesResult,
        numberOfDays: leaveApplicationDates !== null ? leaveApplicationDatesResult.length : null,
      };
    });
    return result;
  }

  async getLeaveApplicationByEmployeeId(employeeId: string) {
    try {
      const ongoing = await this.getOngoingLeaveApplicationByEmployeeIdStatus(employeeId);
      const approved = await this.getLeaveApplicationByEmployeeIdStatus(employeeId, LeaveApplicationStatus.APPROVED);
      const disapproved = await this.getDisapprovedLeaveApplicationByEmployeeIdStatus(employeeId);
      const cancelled = await this.getLeaveApplicationByEmployeeIdStatus(employeeId, LeaveApplicationStatus.CANCELLED);

      return {
        ongoing,
        completed: [...approved, ...disapproved, ...cancelled],
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getLeaveApplicationById(id: string) {
    try {
      const leaveApplications = await this.rawQuery<string, LeaveApplicationType[]>(
        `SELECT
                la.employee_id_fk employeeId,
                la.leave_application_id id,
                if(la.is_late_filing=1,'true','false') isLateFiling,
                la.late_filing_justification lateFilingJustification,
                lb.leave_name leaveName,
                lb.leave_types leaveType,
                la.reference_no referenceNo,
                DATE_FORMAT(la.date_of_filing, '%Y-%m-%d %H:%i:%s') dateOfFiling,
                la.status \`status\`,
                la.reference_no referenceNo,
                lb.maximum_credits maximumCredits,
                la.hrmo_approved_by hrmoApprovedBy,
                la.hrdm_approved_by hrdmApprovedBy,
                DATE_FORMAT(la.hrmo_approval_date, '%Y-%m-%d %H:%i%:%s') hrmoApprovalDate,
                DATE_FORMAT(la.hrdm_approval_date, '%Y-%m-%d %H:%i%:%s') hrdmApprovalDate,
                DATE_FORMAT(la.supervisor_approval_date, '%Y-%m-%d %H:%i%:%s') supervisorApprovalDate,
                la.supervisor_disapproval_remarks supervisorDisapprovalRemarks,
                DATE_FORMAT(la.hrdm_approval_date, '%Y-%m-%d %H:%i%:%s') hrdmApprovalDate,
                la.hrdm_disapproval_remarks hrdmDisapprovalRemarks,
                la.cancel_reason cancelReason,
                la.supervisor_id_fk supervisorId,
                get_leave_date_cancellation_status(la.leave_application_id) leaveDateStatus,
                DATE_FORMAT(la.cancel_date,'%Y-%m-%d %H:%i:%s') cancelDate,
                la.late_filing_justification lateFilingJustification,
                get_leave_date_cancellation_remarks(la.leave_application_id) leaveDateCancellationRemarks 
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
          WHERE la.leave_application_id = ? 
          ORDER BY la.date_of_filing DESC;`,
        [id]
      );
      const { debitValue } = (await this.rawQuery(`SELECT get_debit_value(?) debitValue`, [id]))[0];

      const leaveApplicationsWithDates = await Promise.all(
        leaveApplications.map(async (leaveApplication) => {
          const {
            hrdmApprovedBy,
            hrmoApprovedBy,
            hrdmApprovalDate,
            hrmoApprovalDate,
            employeeId,
            supervisorApprovalDate,
            ...restOfLeaveApplication
          } = leaveApplication;

          const hrdmDetails = hrdmApprovedBy === null ? null : await this.employeesService.getEmployeeDetailsWithSignature(hrdmApprovedBy);
          //const hrdmSignature = hrdmApprovedBy ===
          const hrmoDetails = hrmoApprovedBy === null ? null : await this.employeesService.getEmployeeDetailsWithSignature(hrmoApprovedBy);

          const leaveDates = await this.rawQuery<string, { leaveDate: string }[]>(
            `
              SELECT DATE_FORMAT(leave_date,'%Y-%m-%d') leaveDate FROM leave_application_dates WHERE leave_application_id_fk = ? ORDER BY leave_date ASC; 
          `,
            [leaveApplication.id]
          );

          const employeeDetails = await this.employeesService.getEmployeeDetailsWithSignature(employeeId);

          const supervisorDetails = await this.employeesService.getEmployeeDetailsWithSignature(leaveApplication.supervisorId);

          const forCancellationLeaveDates = (
            (await this.leaveApplicationDatesService.getLeaveDatesByLeaveApplicationIdAndStatus(
              leaveApplication.id,
              LeaveDayStatus.FOR_CANCELLATION
            )) as { leaveDate: string }[]
          ).map((ld) => ld.leaveDate);

          const cancelledLeaveDates = (
            (await this.leaveApplicationDatesService.getLeaveDatesByLeaveApplicationIdAndStatus(leaveApplication.id, LeaveDayStatus.CANCELLED)) as {
              leaveDate: string;
            }[]
          ).map((ld) => ld.leaveDate);

          return {
            employeeName: employeeDetails.employeeFullName,
            employeeSignature: employeeDetails.signatureUrl,
            hrdmApprovedByName: hrdmApprovedBy !== null ? hrdmDetails.employeeFullName : null,
            hrdmSignature: hrdmApprovedBy !== null ? hrdmDetails.signatureUrl : null,
            hrdmApprovalDate,
            hrmoApprovalDate,
            hrmoApprovedByName: hrmoApprovedBy !== null ? hrmoDetails.employeeFullName : null,
            hrmoSignature: hrmoApprovedBy !== null ? hrmoDetails.signatureUrl : null,
            supervisorName: supervisorDetails.employeeFullName,
            supervisorApprovalDate,
            supervisorSignature: supervisorDetails.signatureUrl,
            ...restOfLeaveApplication,
            debitValue,
            leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)),
            forCancellationLeaveDates,
            cancelledLeaveDates,
          };
        })
      );
      return leaveApplicationsWithDates;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getOngoingLeaveApplicationByEmployeeIdStatus(employeeId: string) {
    try {
      const leaveApplications = await this.rawQuery<string, LeaveApplicationType[]>(
        `SELECT
            la.leave_application_id id,
            lb.leave_name leaveName,
            la.reference_no referenceNo,
            la.for_monetization forMonetization,
            DATE_FORMAT(la.date_of_filing, '%Y-%m-%d %H:%i:%s') dateOfFiling,
            la.is_late_filing isLateFiling,
            la.late_filing_justification lateFilingJustification,
            la.status \`status\`,
            la.cancel_reason cancelReason,
            DATE_FORMAT(la.cancel_date,'%Y-%m-%d %H:%i:%s') cancelDate,
            la.for_monetization forMonetization
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
          WHERE la.employee_id_fk = ? AND la.status <> 'approved' AND la.status NOT LIKE '%disapproved%' AND la.status <> 'cancelled' 
          ORDER BY la.date_of_filing DESC;`,
        [employeeId]
      );

      const leaveApplicationsWithDates = await Promise.all(
        leaveApplications.map(async (leaveApplication) => {
          const leaveDates = await this.rawQuery<string, { leaveDate: string }[]>(
            `
              SELECT DATE_FORMAT(leave_date,'%Y-%m-%d') leaveDate FROM leave_application_dates WHERE leave_application_id_fk = ? ORDER BY leave_date ASC; 
          `,
            [leaveApplication.id]
          );
          let monetizationDetails = null;
          if (leaveApplication.leaveName === 'Monetization') {
            monetizationDetails = await this.leaveMonetizationService.crud().findOneOrNull({
              find: {
                select: {
                  id: true,
                  convertedSl: true,
                  monetizedAmount: true,
                  convertedVl: true,
                  monetizationType: true,
                  leaveApplicationId: { id: true },
                },
                where: { leaveApplicationId: { id: leaveApplication.id } },
              },
            });
          }

          return {
            ...leaveApplication,
            ...monetizationDetails,
            id: leaveApplication.id,
            leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)),
          };
        })
      );

      return leaveApplicationsWithDates;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getDisapprovedLeaveApplicationByEmployeeIdStatus(employeeId: string) {
    try {
      const leaveApplications = await this.rawQuery<string, LeaveApplicationType[]>(
        `SELECT
            la.leave_application_id id,
            lb.leave_name leaveName,
            DATE_FORMAT(la.date_of_filing, '%Y-%m-%d %H:%i:%s') dateOfFiling,
            la.status \`status\`,
            la.cancel_reason cancelReason,
            la.reference_no referenceNo,
            la.is_late_filing isLateFiling,
            la.late_filing_justification lateFilingJustification,
            DATE_FORMAT(la.cancel_date,'%Y-%m-%d %H:%i%:%s') cancelDate 
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
          WHERE la.employee_id_fk = ? AND (la.status = 'disapproved by hrmo' OR la.status = 'disapproved by supervisor' OR la.status = 'disapproved by hrdm')  
          ORDER BY la.date_of_filing DESC;`,
        [employeeId]
      );

      const leaveApplicationsWithDates = await Promise.all(
        leaveApplications.map(async (leaveApplication) => {
          const leaveDates = await this.rawQuery<string, { leaveDate: string }[]>(
            `
              SELECT DATE_FORMAT(leave_date,'%Y-%m-%d') leaveDate FROM leave_application_dates WHERE leave_application_id_fk = ? ORDER BY leave_date ASC; 
          `,
            [leaveApplication.id]
          );
          return { ...leaveApplication, leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)) };
        })
      );
      return leaveApplicationsWithDates;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getLeaveApplicationByEmployeeIdStatus(employeeId: string, status: LeaveApplicationStatus) {
    try {
      const leaveApplications = (await this.rawQuery<string, LeaveApplicationType[]>(
        `SELECT
            la.leave_application_id id,
            lb.leave_name leaveName,
            DATE_FORMAT(la.date_of_filing, '%Y-%m-%d %H:%i%:%s') dateOfFiling,
            la.status \`status\`,
            DATE_FORMAT(la.hrmo_approval_date, '%Y-%m-%d %H:%i%:%s') hrmoApprovalDate,
            DATE_FORMAT(la.supervisor_approval_date, '%Y-%m-%d %H:%i%:%s') supervisorApprovalDate,
            la.supervisor_disapproval_remarks supervisorDisapprovalRemarks,
            DATE_FORMAT(la.hrdm_approval_date, '%Y-%m-%d %H:%i%:%s') hrdmApprovalDate,
            la.hrdm_disapproval_remarks hrdmDisapprovalRemarks,
            la.cancel_reason cancelReason,
            la.for_monetization forMonetization,
            la.reference_no referenceNo,
            la.is_late_filing isLateFiling,
            la.late_filing_justification lateFilingJustification,
            DATE_FORMAT(la.cancel_date,'%Y-%m-%d %H:%i%:%s') cancelDate 
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
          WHERE la.employee_id_fk = ? AND la.status = ? 
          ORDER BY la.date_of_filing DESC;`,
        [employeeId, status]
      )) as LeaveApplicationType[];

      const leaveApplicationsWithDates = await Promise.all(
        leaveApplications.map(async (leaveApplication) => {
          const leaveDates = await this.rawQuery<string, { leaveDate: string }[]>(
            `
              SELECT DATE_FORMAT(leave_date,'%Y-%m-%d') leaveDate FROM leave_application_dates WHERE leave_application_id_fk = ? ORDER BY leave_date ASC; 
          `,
            [leaveApplication.id]
          );

          let monetizationDetails = null;
          if (leaveApplication.leaveName === 'Monetization') {
            monetizationDetails = await this.leaveMonetizationService.crud().findOneOrNull({
              find: {
                select: {
                  id: true,
                  convertedSl: true,
                  monetizedAmount: true,
                  convertedVl: true,
                  monetizationType: true,
                  leaveApplicationId: { id: true },
                },
                where: { leaveApplicationId: { id: leaveApplication.id } },
              },
            });
          }

          return {
            ...leaveApplication,
            leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)),
            ...monetizationDetails,
            id: leaveApplication.id,
            //leaveMonetizationId: monetizationDetails.id,
          };
        })
      );

      return leaveApplicationsWithDates;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getVacationLeaveDetails(leaveApplicationId: string, isRPC?: boolean) {
    try {
      const vacationLeaveDetails = await this.rawQuery<string, VacationLeaveDetails[]>(
        `SELECT 
          COALESCE(IF(in_philippines IS NOT NULL OR '','Within the Philippines',null),IF(abroad IS NOT NULL OR '','Abroad',null)) inPhilippinesOrAbroad,
          COALESCE(in_philippines,abroad) location
       FROM leave_application WHERE leave_application_id = ?`,
        [leaveApplicationId]
      );
      return vacationLeaveDetails[0];
    } catch (error) {
      if (isRPC) throw new RpcException(error.message);
      throw new NotFoundException(error.message);
    }
  }

  async getSickLeaveDetails(leaveApplicationId: string, isRPC?: boolean) {
    try {
      const sickLeaveDetails = await this.rawQuery<string, SickLeaveDetails[]>(
        `
        SELECT 
            COALESCE(IF(in_hospital IS NOT NULL OR '','In Hospital',null),IF(out_patient IS NOT NULL OR '','Out Patient',null)) hospital,
            COALESCE(in_hospital,out_patient) illness 
         FROM leave_application WHERE leave_application_id = ?
        `,
        [leaveApplicationId]
      );

      return sickLeaveDetails[0];
    } catch (error) {
      if (isRPC) throw new RpcException(error.message);
      throw new NotFoundException(error.message);
    }
  }

  async getStudyLeaveDetails(leaveApplicationId: string, isRPC?: boolean) {
    try {
      const studyLeaveDetails = await this.rawQuery<string, StudyLeaveDetails[]>(
        `
        SELECT 
            IF(for_masters_completion IS NULL,false,for_masters_completion) forMastersCompletion,
            IF(for_bar_board_review IS NULL,FALSE,for_bar_board_review) forBarBoardReview,
            study_leave_other studyLeaveOther
         FROM leave_application WHERE leave_application_id = ?
        `,
        [leaveApplicationId]
      );
      return studyLeaveDetails[0];
    } catch (error) {
      if (isRPC) throw new RpcException(error.message);
      throw new NotFoundException(error.message);
    }
  }

  async getSpecialLeaveBenefitsForWomenDetails(leaveApplicationId: string, isRPC?: boolean) {
    try {
      const specialLeaveBenefitsForWomenDetails = await this.rawQuery<string, { splWomen: string }[]>(
        `
        SELECT spl_women splWomen FROM leave_application WHERE leave_application_id = ?
      `,
        [leaveApplicationId]
      );
      return specialLeaveBenefitsForWomenDetails[0];
    } catch (error) {
      if (isRPC) throw new RpcException(error.message);
      throw new NotFoundException(error.message);
    }
  }

  async getLeaveApplicationDetails(leaveApplicationId: string, employeeId: string) {
    const leaveApplicationBasicInfo = (await this.getLeaveApplicationById(leaveApplicationId))[0];
    const _id = employeeId;
    const employeeDetails = await this.client.call<
      string,
      string,
      {
        userId: string;
        companyId: string;
        assignment: {
          id: string;
          name: string;
          positionId: string;
          positionTitle: string;
        };
        userRole: string;
      }
    >({
      action: 'send',
      payload: _id,
      pattern: 'find_employee_ems',
      onError: (error) => new NotFoundException(error),
    });

    const { leaveName } = leaveApplicationBasicInfo;
    if (leaveName === 'Vacation Leave' || leaveName === 'Special Privilege Leave' || leaveName === 'Forced Leave') {
      const leaveApplicationDetails = await this.getVacationLeaveDetails(leaveApplicationId);
      return { employeeDetails, leaveApplicationBasicInfo, leaveApplicationDetails };
    } else if (leaveName === 'Sick Leave') {
      const leaveApplicationDetails = await this.getSickLeaveDetails(leaveApplicationId);
      return { employeeDetails, leaveApplicationBasicInfo, leaveApplicationDetails };
    } else if (leaveName === 'Study Leave') {
      const leaveApplicationDetails = await this.getStudyLeaveDetails(leaveApplicationId);
      return { employeeDetails, leaveApplicationBasicInfo, leaveApplicationDetails };
    } else if (leaveName === 'Special Leave Benefits for Women') {
      const leaveApplicationDetails = await this.getSpecialLeaveBenefitsForWomenDetails(leaveApplicationId);
      return { employeeDetails, leaveApplicationBasicInfo, leaveApplicationDetails };
    } else if (leaveName === 'Monetization') {
      const leaveApplicationDetails = await this.getFormattedMonetizationDetails(leaveApplicationId);
      return { employeeDetails, leaveApplicationBasicInfo, leaveApplicationDetails };
    } else if (leaveName === 'Terminal Leave') {
      const leaveApplicationDetails = await this.getTerminalLeaveDetails(leaveApplicationId);
      return { employeeDetails, leaveApplicationBasicInfo, leaveApplicationDetails };
    } else {
      return { employeeDetails, leaveApplicationBasicInfo };
    }
  }

  async getTerminalLeaveDetails(leaveApplicationId: string) {
    const monetizationDetails = await this.getMonetizationDetails(leaveApplicationId);
    const leaveApplication = await this.crud().findOne({ find: { select: { id: true, employeeId: true }, where: { id: leaveApplicationId } } });
    const leaveApplicationDate = await this.leaveApplicationDatesService
      .crud()
      .findOne({ find: { select: { id: true, leaveDate: true }, where: { leaveApplicationId: leaveApplication } } });
    const { dailyLeaveCredit } = (await this.rawQuery(`SELECT value dailyLeaveCredit FROM ems_settings WHERE name= 'daily_leave_credit';`))[0] as {
      dailyLeaveCredit: number;
    };
    const excessCreditEarnings =
      Math.round(parseFloat(dailyLeaveCredit.toString()) * parseInt(dayjs(leaveApplicationDate.leaveDate).format('DD')) * 1000) / 1000;

    const { convertedSl, convertedVl, monetizedAmount } = monetizationDetails;
    const formattedMonetizedAmount = Math.trunc(parseFloat(monetizedAmount.toString()) * 1000) / 1000;
    return {
      monetizedAmount:
        '₱ ' +
        formattedMonetizedAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      slBalance: {
        beforeTerminalLeave: Math.trunc((parseFloat(convertedSl.toString()) - excessCreditEarnings) * 1000) / 1000,
        afterTerminalLeave: parseFloat(convertedSl.toString()),
      },
      vlBalance: {
        beforeTerminalLeave: Math.trunc((parseFloat(convertedVl.toString()) - excessCreditEarnings) * 1000) / 1000,
        afterTerminalLeave: parseFloat(convertedVl.toString()),
      },
    };
  }

  async getFormattedMonetizationDetails(leaveApplicationId: string) {
    const { convertedSl, convertedVl, monetizedAmount, monetizationType } = await this.getMonetizationDetails(leaveApplicationId);
    const formattedMonetizedAmount = Math.trunc(parseFloat(monetizedAmount.toString()) * 1000) / 1000;
    return {
      monetizationType,
      monetizedAmount:
        '₱ ' +
        formattedMonetizedAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      convertedSl,
      convertedVl,
    };
  }

  async getMonetizationDetails(leaveApplicationId: string) {
    return await this.leaveMonetizationService.crud().findOne({
      find: {
        select: { convertedSl: true, id: true, convertedVl: true, leaveApplicationId: { id: true }, monetizedAmount: true, monetizationType: true },
        where: { leaveApplicationId: { id: leaveApplicationId } },
      },
    });
  }

  async getUnavailableDates(employeeId: string) {
    /*
     return await this.rawQuery(
      `
      SELECT DISTINCT unavailableDates.unavailableDate \`date\`, type 
      FROM 
      ((SELECT DATE_FORMAT(leave_date, '%Y-%m-%d') AS unavailableDate,'Leave' AS type FROM leave_application la 
        INNER JOIN leave_application_dates lad ON la.leave_application_id=lad.leave_application_id_fk 
        WHERE la.employee_id_fk = ? AND (la.status = 'approved' OR la.status='for hrmo credit certification' OR la.status='for hrdm approval' or la.status='for supervisor approval'
        ))
      UNION 
      (SELECT DATE_FORMAT(holiday_date, '%Y-%m-%d') unavailableDate,'Holiday' AS type FROM holidays 
      WHERE holiday_date BETWEEN DATE_SUB(DATE_SUB(now(), INTERVAL 6 MONTH),INTERVAL 1 DAY) AND DATE_ADD(DATE_ADD(now(), INTERVAL 6 MONTH),INTERVAL 1 DAY))) AS unavailableDates 
      ORDER BY unavailableDates.unavailableDate ASC`,
      [employeeId]
    );now() dateTimeNow 
    */
    const unavailableDates = await this.rawQuery(
      `
      SELECT DISTINCT unavailableDates.unavailableDate \`date\`, type 
      FROM 
      ((SELECT DATE_FORMAT(leave_date, '%Y-%m-%d') AS unavailableDate,'Leave' AS type FROM leave_application la 
        INNER JOIN leave_application_dates lad ON la.leave_application_id=lad.leave_application_id_fk 
        WHERE la.employee_id_fk = ? AND ( (la.status = 'approved' AND lad.status = 'approved') OR (la.status = 'approved' AND lad.status = 'for cancellation') OR la.status='for hrmo credit certification' OR la.status='for hrdm approval' or la.status='for supervisor approval'))
      UNION 
      (SELECT DATE_FORMAT(holiday_date, '%Y-%m-%d') unavailableDate,'Holiday' AS type FROM holidays 
      WHERE holiday_date BETWEEN DATE_SUB(DATE_SUB(now(), INTERVAL 6 MONTH),INTERVAL 1 DAY) AND DATE_ADD(DATE_ADD(now(), INTERVAL 6 MONTH),INTERVAL 1 DAY))) AS unavailableDates 
      ORDER BY unavailableDates.unavailableDate ASC;`,
      [employeeId]
    );
    const dateTimeNow = await this.rawQuery(`SELECT DATE_FORMAT(now(),'%Y-%m-%d') dateTimeNow;`);
    return {
      unavailableDates,
      dateTimeNow: dateTimeNow[0].dateTimeNow,
    };
  }

  async getLeavesForHrApproval() {
    return await this.getLeavesByLeaveApplicationStatus(LeaveApplicationStatus.ONGOING);
  }

  async getLeavesForHrdm() {
    const forApproval = await this.getLeavesByLeaveApplicationStatus(LeaveApplicationStatus.FOR_HRDM_APPROVAL);
    const completed = await this.getCompletedLeavesForHrdm();
    return { forApproval, completed: { approved: completed.approved, disapproved: completed.disapproved, cancelled: completed.cancelled } };
  }

  async getCompletedLeavesForHrdm() {
    const leaves = <LeaveApplication[]>await this.crud().findAll({
      find: {
        select: {
          id: true,
          abroad: true,
          dateOfFiling: true,
          employeeId: true,
          forBarBoardReview: true,
          forMastersCompletion: true,
          forMonetization: true,
          hrdmApprovalDate: true,
          hrdmDisapprovalRemarks: true,
          hrmoApprovalDate: true,
          supervisorApprovalDate: true,
          supervisorDisapprovalRemarks: true,
          inHospital: true,
          inPhilippines: true,
          supervisorId: true,
          studyLeaveOther: true,
          referenceNo: true,
          lateFilingJustification: true,
          isTerminalLeave: true,
          outPatient: true,
          cancelDate: true,
          cancelReason: true,
          requestedCommutation: true,
          splWomen: true,
          leaveBenefitsId: { id: true, leaveName: true, leaveType: true },
          status: true,
        },
        relations: { leaveBenefitsId: true },
        where: [
          { status: LeaveApplicationStatus.DISAPPROVED_BY_HRDM },
          { status: LeaveApplicationStatus.APPROVED },
          { status: LeaveApplicationStatus.DISAPPROVED_BY_HRMO },
          { status: LeaveApplicationStatus.DISAPPROVED_BY_SUPERVISOR },
          { status: LeaveApplicationStatus.CANCELLED },
        ],
      },
    });

    const approved = [];
    const disapproved = [];
    const cancelled = [];

    const leavesDetails = await Promise.all(
      leaves.map(async (leave) => {
        const { employeeId, supervisorId, leaveBenefitsId, ...rest } = leave;
        const employeeSupervisorNames = (await this.client.call<
          string,
          { employeeId: string; supervisorId: string },
          { employeeName: string; supervisorName: string }
        >({
          action: 'send',
          payload: { employeeId, supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        })) as { employeeName: string; supervisorName: string };

        const leaveDates = (await this.leaveApplicationDatesService.crud().findAll({
          find: { where: { leaveApplicationId: { id: leave.id } }, select: { leaveDate: true }, order: { leaveDate: 'ASC' } },
        })) as LeaveApplicationDates[];

        const _leaveDates = await Promise.all(
          leaveDates.map(async (leaveDate) => {
            return leaveDate.leaveDate;
          })
        );
        const { employeeName, supervisorName } = employeeSupervisorNames;

        switch (leave.status) {
          case LeaveApplicationStatus.DISAPPROVED_BY_HRDM ||
            LeaveApplicationStatus.DISAPPROVED_BY_HRMO ||
            LeaveApplicationStatus.DISAPPROVED_BY_SUPERVISOR:
            disapproved.push({
              ...rest,
              employee: { employeeId, employeeName },
              supervisor: { supervisorId, supervisorName },
              leaveBenefitsId: leaveBenefitsId.id,
              leaveName: leaveBenefitsId.leaveName,
              leaveDates: _leaveDates,
            });
            break;
          case LeaveApplicationStatus.APPROVED:
            approved.push({
              ...rest,
              employee: { employeeId, employeeName },
              supervisor: { supervisorId, supervisorName },
              leaveBenefitsId: leaveBenefitsId.id,
              leaveName: leaveBenefitsId.leaveName,
              leaveDates: _leaveDates,
            });
            break;
          case LeaveApplicationStatus.CANCELLED:
            cancelled.push({
              ...rest,
              employee: { employeeId, employeeName },
              supervisor: { supervisorId, supervisorName },
              leaveBenefitsId: leaveBenefitsId.id,
              leaveName: leaveBenefitsId.leaveName,
              leaveDates: _leaveDates,
            });
            break;
          default:
            break;
        }

        // return {
        //   ...rest,
        //   employee: { employeeId, employeeName },
        //   supervisor: { supervisorId, supervisorName },
        //   leaveName: leaveBenefitsId.leaveName,
        //   leaveDates: _leaveDates,
        // };
      })
    );
    //return leavesDetails;
    return { approved, disapproved, cancelled };
  }

  async getLeavesForHrdmV2() {
    const leaves = <LeaveApplication[]>await this.crud().findAll({
      find: {
        select: {
          id: true,
          abroad: true,
          dateOfFiling: true,
          employeeId: true,
          forBarBoardReview: true,
          forMastersCompletion: true,
          forMonetization: true,
          hrdmApprovalDate: true,
          hrdmDisapprovalRemarks: true,
          hrmoApprovalDate: true,
          supervisorApprovalDate: true,
          supervisorDisapprovalRemarks: true,
          inHospital: true,
          lateFilingJustification: true,
          inPhilippines: true,
          isTerminalLeave: true,
          isLateFiling: true,
          supervisorId: true,
          studyLeaveOther: true,
          hrdmApprovedBy: true,
          hrmoApprovedBy: true,
          outPatient: true,
          cancelDate: true,
          cancelReason: true,
          referenceNo: true,
          requestedCommutation: true,
          splWomen: true,
          leaveBenefitsId: { id: true, leaveName: true, leaveType: true },
          status: true,
        },
        relations: { leaveBenefitsId: true },
        where: [
          {
            status: LeaveApplicationStatus.FOR_HRDM_APPROVAL,
            dateOfFiling: Between(
              dayjs(dayjs().subtract(2, 'month').format('YYYY-MM') + '-01').toDate(),
              dayjs(dayjs().format('YYYY-MM') + '-' + dayjs().daysInMonth()).toDate()
            ),
          },
          {
            status: LeaveApplicationStatus.APPROVED,
            dateOfFiling: Between(
              dayjs(dayjs().subtract(2, 'month').format('YYYY-MM') + '-01').toDate(),
              dayjs(dayjs().format('YYYY-MM') + '-' + dayjs().daysInMonth()).toDate()
            ),
          },
          {
            status: LeaveApplicationStatus.DISAPPROVED_BY_HRDM,
            dateOfFiling: Between(
              dayjs(dayjs().subtract(2, 'month').format('YYYY-MM') + '-01').toDate(),
              dayjs(dayjs().format('YYYY-MM') + '-' + dayjs().daysInMonth()).toDate()
            ),
          },
        ],
        order: { dateOfFiling: 'DESC' },
      },
    });

    const leavesDetails = await Promise.all(
      leaves.map(async (leave) => {
        const {
          employeeId,
          supervisorId,
          hrmoApprovedBy,
          hrmoApprovalDate,
          hrdmApprovedBy,
          hrdmApprovalDate,
          leaveBenefitsId,
          dateOfFiling,
          ...rest
        } = leave;
        const employeeSupervisorNames = (await this.client.call<
          string,
          { employeeId: string; supervisorId: string },
          { employeeName: string; supervisorName: string }
        >({
          action: 'send',
          payload: { employeeId, supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        })) as { employeeName: string; supervisorName: string };

        const _hrmoApprovedBy = (await this.employeesService.getBasicEmployeeDetails(hrmoApprovedBy)).employeeFullName;

        const employeeDetails = await this.employeesService.getBasicEmployeeDetailsWithSignature(employeeId);

        const leaveDates = (await this.leaveApplicationDatesService.crud().findAll({
          find: { where: { leaveApplicationId: { id: leave.id } }, select: { leaveDate: true }, order: { leaveDate: 'ASC' } },
        })) as LeaveApplicationDates[];

        const _leaveDates = await Promise.all(
          leaveDates.map(async (leaveDate) => {
            return leaveDate.leaveDate;
          })
        );
        let monetizationDetails = null;
        let terminalLeaveDetails = null;

        if (leaveBenefitsId.leaveName === 'Monetization') monetizationDetails = await this.getFormattedMonetizationDetails(leave.id);
        if (leaveBenefitsId.leaveName === 'Terminal Leave') terminalLeaveDetails = await this.getTerminalLeaveDetails(leave.id);

        const { employeeName, supervisorName } = employeeSupervisorNames;
        return {
          ...rest,
          dateOfFiling: dayjs(dateOfFiling).format('YYYY-MM-DD'),
          leaveBenefitsId: leaveBenefitsId.id,
          leaveName: leaveBenefitsId.leaveName,
          hrmoApprovedBy: _hrmoApprovedBy,
          hrmoApprovalDate,
          hrdmApprovedBy,
          hrdmApprovalDate,
          ...monetizationDetails,
          ...terminalLeaveDetails,
          id: rest.id,
          employee: { employeeId, employeeName, companyId: employeeDetails.companyId, signatureUrl: employeeDetails.signatureUrl },
          supervisor: { supervisorId, supervisorName },
          leaveDates: _leaveDates,
        };
      })
    );
    return leavesDetails;
  }

  async getLeavesByYearMonth(yearMonth: string) {
    const _yearMonth = dayjs(yearMonth + '-01').format('YYYY-MM');

    const leaves = (
      (await this.rawQuery(
        `SELECT 
            leave_application.created_at createdAt, 
            leave_application.updated_at updatedAt, 
            leave_application.deleted_at deletedAt, 
            leave_application_id id,
            abroad,
            date_of_filing dateOfFiling,
            employee_id_fk employeeId,
            ${process.env.HRMS_DB_NAME}get_employee_fullname2(employee_id_fk) employeeName,
            ${process.env.HRMS_DB_NAME}get_employee_fullname2(supervisor_id_fk) supervisorName,
            for_bar_board_review forBarBoardReview,
            date_of_filing dateOfFiling,
            for_masters_completion forMastersCompletion,
            for_monetization forMonetization,
            DATE_FORMAT(hrdm_approval_date, '%Y-%m-%d %H:%i:%s') hrdmApprovalDate,
            hrdm_disapproval_remarks hrdmDisapprovalRemarks,
            DATE_FORMAT(hrmo_approval_date, '%Y-%m-%d %H:%i:%s') hrmoApprovalDate,
            DATE_FORMAT(supervisor_approval_date, '%Y-%m-%d %H:%i:%s') supervisorApprovalDate,
            in_hospital inHospital,
            in_philippines inPhilippines,
            is_terminal_leave isTerminalLeave,
            IF(is_late_filing=1,'true','false') isLateFiling,
            late_filing_justification lateFilingJustification,
            supervisor_id_fk supervisorId,
            reference_no referenceNo,
            study_leave_other studyLeaveOther,
            out_patient outPatient,
            DATE_FORMAT(cancel_date, '%Y-%m-%d %H:%i:%s') cancelDate,
            cancel_reason cancelReason,
            requested_commutation requestedCommutation,
            spl_women splWomen,
            leave_benefits_id_fk leaveBenefitsId,
            leave_name leaveName, leave_types leaveType,
            status 
        FROM leave_application INNER JOIN leave_benefits ON leave_application.leave_benefits_id_fk = leave_benefits_id
        WHERE DATE_FORMAT(date_of_filing, '%Y-%m') = ? ORDER BY date_of_filing DESC;  
    `,
        [_yearMonth]
      )) as {
        id: string;
        employeeId: string;
        supervisorId: string;
        leaveBenefitsId: LeaveBenefits;
        dateOfFiling: Date;
        inPhilippines: string;
        abroad: string;
        inHospital: string;
        outPatient: string;
        splWomen: string;
        forMastersCompletion: boolean;
        forBarBoardReview: boolean;
        studyLeaveOther: string;
        forMonetization: boolean;
        isTerminalLeave: boolean;
        requestedCommutation: boolean;
        status: LeaveApplicationStatus;
        cancelReason: string;
        cancelDate: Date;
        hrmoApprovalDate: Date;
        hrmoApprovedBy: string;
        supervisorApprovalDate: Date;
        supervisorDisapprovalRemarks: string;
        hrdmApprovalDate: Date;
        hrdmApprovedBy: string;
        hrdmDisapprovalRemarks: string;
        isLateFiling: boolean;
        lateFilingJustification: string;
        referenceNo: string;
        employeeName: string;
        supervisorName: string;
      }[]
    ).map((la) => {
      const { dateOfFiling, cancelDate, ...restOfLeave } = la;
      return {
        isLateFiling: restOfLeave.isLateFiling,
        dateOfFiling: dayjs(dateOfFiling).format('YYYY-MM-DD'),
        cancelDate: cancelDate === null ? null : dayjs(cancelDate).format('YYYY-MM-DD'),
        ...restOfLeave,
      };
    });

    const leavesDetails = await Promise.all(
      leaves.map(async (leave, idx) => {
        const { employeeId, supervisorId, employeeName, supervisorName, leaveBenefitsId, ...rest } = leave;

        const leaveDates = (await this.leaveApplicationDatesService.crud().findAll({
          find: { where: { leaveApplicationId: { id: leave.id } }, select: { leaveDate: true }, order: { leaveDate: 'ASC' } },
        })) as LeaveApplicationDates[];

        const _leaveDates = await Promise.all(
          leaveDates.map(async (leaveDate) => {
            return leaveDate.leaveDate;
          })
        );

        let monetizationDetails = null;

        if (leaveBenefitsId.leaveName === 'Monetization') {
          monetizationDetails = await this.leaveMonetizationService.crud().findOneOrNull({
            find: {
              select: {
                convertedSl: true,
                convertedVl: true,
                id: true,
                leaveApplicationId: { id: true },
                monetizationType: true,
                monetizedAmount: true,
              },
              where: { leaveApplicationId: { id: leave.id } },
            },
          });
        }

        return {
          ...rest,
          ...monetizationDetails,
          id: rest.id,
          employee: { employeeId, employeeName },
          supervisor: { supervisorId, supervisorName },
          leaveDates: _leaveDates,
        };
      })
    );
    return leavesDetails;
  }

  async getLeavesByLeaveApplicationStatus(leaveApplicationStatus: LeaveApplicationStatus) {
    let leaves = (
      (await this.rawQuery(`
      SELECT 
            leave_application.created_at createdAt, 
            leave_application.updated_at updatedAt, 
            leave_application.deleted_at deletedAt, 
            leave_application_id id,
            abroad,
            date_of_filing dateOfFiling,
            employee_id_fk employeeId,
            ${process.env.HRMS_DB_NAME}get_employee_fullname2(employee_id_fk) employeeName,
            ${process.env.HRMS_DB_NAME}get_employee_fullname2(supervisor_id_fk) supervisorName,
            for_bar_board_review forBarBoardReview,
            date_of_filing dateOfFiling,
            for_masters_completion forMastersCompletion,
            for_monetization forMonetization,
            DATE_FORMAT(hrdm_approval_date, '%Y-%m-%d %H:%i:%s') hrdmApprovalDate,
            hrdm_disapproval_remarks hrdmDisapprovalRemarks,
            DATE_FORMAT(hrmo_approval_date, '%Y-%m-%d %H:%i:%s') hrmoApprovalDate,
            DATE_FORMAT(supervisor_approval_date, '%Y-%m-%d %H:%i:%s') supervisorApprovalDate,
            in_hospital inHospital,
            in_philippines inPhilippines,
            is_terminal_leave isTerminalLeave,
            IF(is_late_filing=1,'true','false') isLateFiling,
            late_filing_justification lateFilingJustification,
            supervisor_id_fk supervisorId,
            reference_no referenceNo,
            study_leave_other studyLeaveOther,
            out_patient outPatient,
            DATE_FORMAT(cancel_date, '%Y-%m-%d %H:%i:%s') cancelDate,
            cancel_reason cancelReason,
            requested_commutation requestedCommutation,
            spl_women splWomen,
            leave_benefits_id_fk leaveBenefitsId,
            leave_name leaveName, leave_types leaveType,
            status 
        FROM leave_application INNER JOIN leave_benefits ON leave_application.leave_benefits_id_fk = leave_benefits_id 
      ORDER BY date_of_filing DESC;  
    `)) as HrmoLeaveApplicationListItem[]
    ).map((la) => {
      const { dateOfFiling, cancelDate, ...restOfLeave } = la;
      return {
        dateOfFiling: dayjs(dateOfFiling).format('YYYY-MM-DD'),
        cancelDate: cancelDate === null ? null : dayjs(cancelDate).format('YYYY-MM-DD'),
        ...restOfLeave,
      };
    });

    if (leaveApplicationStatus !== null) {
      leaves = (
        (await this.rawQuery(
          `
        SELECT 
              leave_application.created_at createdAt, 
              leave_application.updated_at updatedAt, 
              leave_application.deleted_at deletedAt, 
              leave_application_id id,
              abroad,
              date_of_filing dateOfFiling,
              employee_id_fk employeeId,
              ${process.env.HRMS_DB_NAME}get_employee_fullname2(employee_id_fk) employeeName,
              ${process.env.HRMS_DB_NAME}get_employee_fullname2(supervisor_id_fk) supervisorName,
              for_bar_board_review forBarBoardReview,
              date_of_filing dateOfFiling,
              for_masters_completion forMastersCompletion,
              for_monetization forMonetization,
              DATE_FORMAT(hrdm_approval_date, '%Y-%m-%d %H:%i:%s') hrdmApprovalDate,
              hrdm_disapproval_remarks hrdmDisapprovalRemarks,
              DATE_FORMAT(hrmo_approval_date, '%Y-%m-%d %H:%i:%s') hrmoApprovalDate,
              DATE_FORMAT(supervisor_approval_date, '%Y-%m-%d %H:%i:%s') supervisorApprovalDate,
              in_hospital inHospital,
              in_philippines inPhilippines,
              is_terminal_leave isTerminalLeave,
              IF(is_late_filing=1,'true','false') isLateFiling,
              late_filing_justification lateFilingJustification,
              supervisor_id_fk supervisorId,
              reference_no referenceNo,
              study_leave_other studyLeaveOther,
              out_patient outPatient,
              DATE_FORMAT(cancel_date, '%Y-%m-%d %H:%i:%s') cancelDate,
              cancel_reason cancelReason,
              requested_commutation requestedCommutation,
              spl_women splWomen,
              leave_benefits_id_fk leaveBenefitsId,
              leave_name leaveName, leave_types leaveType,
              status 
          FROM leave_application INNER JOIN leave_benefits ON leave_application.leave_benefits_id_fk = leave_benefits_id 
          WHERE status = ? 
        ORDER BY date_of_filing DESC;  
      `,
          [leaveApplicationStatus]
        )) as HrmoLeaveApplicationListItem[]
      ).map((la) => {
        const { dateOfFiling, cancelDate, ...restOfLeave } = la;
        return {
          dateOfFiling: dayjs(dateOfFiling).format('YYYY-MM-DD'),
          cancelDate: cancelDate === null ? null : dayjs(cancelDate).format('YYYY-MM-DD'),
          ...restOfLeave,
        };
      });
    }

    const leavesDetails = await Promise.all(
      leaves.map(async (leave, idx) => {
        const { employeeId, supervisorId, employeeName, supervisorName, leaveBenefitsId, leaveName, leaveType, ...rest } = leave;

        const leaveDates = (await this.leaveApplicationDatesService.crud().findAll({
          find: { where: { leaveApplicationId: { id: leave.id } }, select: { leaveDate: true }, order: { leaveDate: 'ASC' } },
        })) as LeaveApplicationDates[];

        const _leaveDates = await Promise.all(
          leaveDates.map(async (leaveDate) => {
            return leaveDate.leaveDate;
          })
        );

        let monetizationDetails = null;

        if (leaveName === 'Monetization') {
          monetizationDetails = await this.leaveMonetizationService.crud().findOneOrNull({
            find: {
              select: {
                convertedSl: true,
                convertedVl: true,
                id: true,
                leaveApplicationId: { id: true },
                monetizationType: true,
                monetizedAmount: true,
              },
              where: { leaveApplicationId: { id: leave.id } },
            },
          });
        }

        return {
          ...rest,
          leaveBenefitsId: leaveBenefitsId,
          leaveName: leaveName,
          ...monetizationDetails,
          id: rest.id,
          employee: { employeeId, employeeName },
          supervisor: { supervisorId, supervisorName },
          leaveDates: _leaveDates,
        };
      })
    );
    return leavesDetails;
  }

  async getApprovedLeavesUnderSupervisor(supervisorId: string) {
    const leaves = <LeaveApplication[]>await this.crud().findAll({
      find: {
        select: {
          id: true,
          abroad: true,
          dateOfFiling: true,
          employeeId: true,
          forBarBoardReview: true,
          forMastersCompletion: true,
          forMonetization: true,
          hrdmApprovalDate: true,
          hrdmDisapprovalRemarks: true,
          referenceNo: true,
          hrmoApprovalDate: true,
          supervisorApprovalDate: true,
          supervisorDisapprovalRemarks: true,
          inHospital: true,
          inPhilippines: true,
          supervisorId: true,
          studyLeaveOther: true,
          isTerminalLeave: true,
          outPatient: true,
          requestedCommutation: true,
          isLateFiling: true,
          cancelDate: true,
          cancelReason: true,
          splWomen: true,
          leaveBenefitsId: { leaveName: true, leaveType: true },
          status: true,
        },
        relations: { leaveBenefitsId: true },
        where: [{ supervisorId, status: LeaveApplicationStatus.FOR_HRDM_APPROVAL }],
      },
    });

    const leavesDetails = await Promise.all(
      leaves.map(async (leave) => {
        const { employeeId, leaveBenefitsId, ...rest } = leave;
        const employeeSupervisorNames = (await this.client.call<
          string,
          { employeeId: string; supervisorId: string },
          { employeeName: string; supervisorName: string }
        >({
          action: 'send',
          payload: { employeeId, supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        })) as { employeeName: string; supervisorName: string };
        const { employeeName, supervisorName } = employeeSupervisorNames;

        const leaveDates = await this.rawQuery<string, { leaveDate: string }[]>(
          `
                SELECT DATE_FORMAT(leave_date,'%Y-%m-%d') leaveDate FROM leave_application_dates WHERE leave_application_id_fk = ? ORDER BY leave_date ASC; 
            `,
          [leave.id]
        );
        return {
          ...rest,
          leaveBenefitsId: leaveBenefitsId.id,
          leaveName: leaveBenefitsId.leaveName,
          leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)),
          employee: { employeeId, employeeName },
          supervisor: { supervisorId, supervisorName },
        };
      })
    );
    return leavesDetails;
  }

  async getAllLeavesUnderSupervisor(supervisorId: string) {
    const leaves = <LeaveApplication[]>await this.crud().findAll({
      find: {
        select: {
          id: true,
          abroad: true,
          dateOfFiling: true,
          employeeId: true,
          forBarBoardReview: true,
          forMastersCompletion: true,
          forMonetization: true,
          hrdmApprovalDate: true,
          hrdmDisapprovalRemarks: true,
          hrmoApprovalDate: true,
          supervisorApprovalDate: true,
          supervisorDisapprovalRemarks: true,
          inHospital: true,
          inPhilippines: true,
          supervisorId: true,
          studyLeaveOther: true,
          isTerminalLeave: true,
          referenceNo: true,
          isLateFiling: true,
          outPatient: true,
          cancelDate: true,
          cancelReason: true,
          requestedCommutation: true,
          lateFilingJustification: true,
          splWomen: true,
          leaveBenefitsId: { leaveName: true, leaveType: true },
          status: true,
        },
        relations: { leaveBenefitsId: true },
        where: { supervisorId },
        order: { status: 'DESC', dateOfFiling: 'DESC' },
      },
    });
    // const approved: LeaveApplication[];
    const disapproved = [];
    const cancelled = [];

    const leavesDetails = await Promise.all(
      leaves.map(async (leave) => {
        const { employeeId, leaveBenefitsId, dateOfFiling, ...rest } = leave;
        const employeeDetails = await this.employeesService.getBasicEmployeeDetailsWithSignature(employeeId);
        const companyId = (await this.employeesService.getBasicEmployeeDetails(employeeId)).companyId;

        const employeeSupervisorNames = (await this.client.call<
          string,
          { employeeId: string; supervisorId: string },
          { employeeName: string; supervisorName: string }
        >({
          action: 'send',
          payload: { employeeId, supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        })) as { employeeName: string; supervisorName: string };
        const { employeeName, supervisorName } = employeeSupervisorNames;

        const leaveDates = await this.rawQuery<string, { leaveDate: string }[]>(
          `
                SELECT DATE_FORMAT(leave_date,'%Y-%m-%d') leaveDate FROM leave_application_dates WHERE leave_application_id_fk = ? ORDER BY leave_date ASC; 
            `,
          [leave.id]
        );

        let monetizationDetails = null;
        let terminalLeaveDetails = null;

        if (leaveBenefitsId.leaveName === 'Monetization') monetizationDetails = await this.getFormattedMonetizationDetails(leave.id);
        if (leaveBenefitsId.leaveName === 'Terminal Leave') terminalLeaveDetails = await this.getTerminalLeaveDetails(leave.id);

        return {
          ...rest,
          dateOfFiling: dayjs(dateOfFiling).format('YYYY-MM-DD'),
          leaveBenefitsId: leaveBenefitsId.id,
          leaveName: leaveBenefitsId.leaveName,
          ...terminalLeaveDetails,
          ...monetizationDetails,
          id: rest.id,
          leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)),
          employee: { employeeId, companyId, employeeName, signatureUrl: employeeDetails.signatureUrl },
          supervisor: { supervisorId, supervisorName },
        };
      })
    );
    return leavesDetails;
  }

  async getDisapprovedCancelledLeavesUnderSupervisor(supervisorId: string) {
    const leaves = <LeaveApplication[]>await this.crud().findAll({
      find: {
        select: {
          id: true,
          abroad: true,
          dateOfFiling: true,
          employeeId: true,
          forBarBoardReview: true,
          forMastersCompletion: true,
          forMonetization: true,
          hrdmApprovalDate: true,
          hrdmDisapprovalRemarks: true,
          hrmoApprovalDate: true,
          supervisorApprovalDate: true,
          supervisorDisapprovalRemarks: true,
          inHospital: true,
          inPhilippines: true,
          supervisorId: true,
          studyLeaveOther: true,
          isTerminalLeave: true,
          isLateFiling: true,
          referenceNo: true,
          outPatient: true,
          cancelDate: true,
          lateFilingJustification: true,
          cancelReason: true,
          requestedCommutation: true,
          splWomen: true,
          leaveBenefitsId: { leaveName: true, leaveType: true },
          status: true,
        },
        relations: { leaveBenefitsId: true },
        where: [
          { supervisorId, status: LeaveApplicationStatus.CANCELLED },
          { supervisorId, status: LeaveApplicationStatus.DISAPPROVED_BY_SUPERVISOR },
          { supervisorId, status: LeaveApplicationStatus.DISAPPROVED_BY_HRDM },
        ],
      },
    });
    // const approved: LeaveApplication[];
    const disapproved = [];
    const cancelled = [];

    const leavesDetails = await Promise.all(
      leaves.map(async (leave) => {
        const { employeeId, leaveBenefitsId, ...rest } = leave;
        const employeeSupervisorNames = (await this.client.call<
          string,
          { employeeId: string; supervisorId: string },
          { employeeName: string; supervisorName: string }
        >({
          action: 'send',
          payload: { employeeId, supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        })) as { employeeName: string; supervisorName: string };
        const { employeeName, supervisorName } = employeeSupervisorNames;

        const leaveDates = await this.rawQuery<string, { leaveDate: string }[]>(
          `
                SELECT DATE_FORMAT(leave_date,'%Y-%m-%d') leaveDate FROM leave_application_dates WHERE leave_application_id_fk = ? ORDER BY leave_date ASC; 
            `,
          [leave.id]
        );

        switch (leave.status) {
          case 'cancelled':
            cancelled.push({
              ...rest,
              leaveBenefitsId: leaveBenefitsId.id,
              leaveName: leaveBenefitsId.leaveName,
              leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)),
              employee: { employeeId, employeeName },
              supervisor: { supervisorId, supervisorName },
            });
            break;
          default:
            disapproved.push({
              ...rest,
              leaveBenefitsId: leaveBenefitsId.id,
              leaveName: leaveBenefitsId.leaveName,
              leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)),
              employee: { employeeId, employeeName },
              supervisor: { supervisorId, supervisorName },
            });
            break;
        }
      })
    );
    return { cancelled, disapproved };
  }

  // async getAllLeavesUnderSupervisor(supervisorId: string){
  //   return await this.leaveApplicationDatesService
  // }

  async getLeavesUnderSupervisor(supervisorId: string) {
    const forApproval = await this.getPendingLeavesUnderSupervisor(supervisorId);
    const { cancelled, disapproved } = await this.getDisapprovedCancelledLeavesUnderSupervisor(supervisorId);

    const completed = {
      approved: await this.getApprovedLeavesUnderSupervisor(supervisorId),
      cancelled,
      disapproved,
    };
    return { forApproval, completed };
  }

  async getPendingLeavesUnderSupervisor(supervisorId: string) {
    const leaves = <LeaveApplication[]>await this.crud().findAll({
      find: {
        select: {
          id: true,
          abroad: true,
          dateOfFiling: true,
          employeeId: true,
          forBarBoardReview: true,
          forMastersCompletion: true,
          forMonetization: true,
          hrdmApprovalDate: true,
          hrdmDisapprovalRemarks: true,
          hrmoApprovalDate: true,
          supervisorApprovalDate: true,
          supervisorDisapprovalRemarks: true,
          inHospital: true,
          inPhilippines: true,
          isTerminalLeave: true,
          referenceNo: true,
          isLateFiling: true,
          outPatient: true,
          requestedCommutation: true,
          supervisorId: true,
          studyLeaveOther: true,
          lateFilingJustification: true,
          cancelDate: true,
          cancelReason: true,
          splWomen: true,
          leaveBenefitsId: { leaveName: true, leaveType: true },
          status: true,
        },
        relations: { leaveBenefitsId: true },
        where: [{ supervisorId, status: LeaveApplicationStatus.FOR_SUPERVISOR_APPROVAL }],
      },
    });

    const leavesDetails = await Promise.all(
      leaves.map(async (leave) => {
        const { employeeId, leaveBenefitsId, ...rest } = leave;
        const employeeSupervisorNames = (await this.client.call<
          string,
          { employeeId: string; supervisorId: string },
          { employeeName: string; supervisorName: string }
        >({
          action: 'send',
          payload: { employeeId, supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        })) as { employeeName: string; supervisorName: string };
        const { employeeName, supervisorName } = employeeSupervisorNames;

        const leaveDates = await this.rawQuery<string, { leaveDate: string }[]>(
          `
                SELECT DATE_FORMAT(leave_date,'%Y-%m-%d') leaveDate FROM leave_application_dates WHERE leave_application_id_fk = ? ORDER BY leave_date ASC; 
            `,
          [leave.id]
        );
        return {
          ...rest,
          leaveBenefitsId: leaveBenefitsId.id,
          leaveName: leaveBenefitsId.leaveName,
          leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)),
          employee: { employeeId, employeeName },
          supervisor: { supervisorId, supervisorName },
          details: (await this.getLeaveApplicationDetails(rest.id, employeeId)).leaveApplicationDetails,
        };
      })
    );
    return leavesDetails;
  }
}
