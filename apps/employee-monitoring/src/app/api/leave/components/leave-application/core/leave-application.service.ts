import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveApplicationDto, LeaveApplicationDates, UpdateLeaveApplicationDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LeaveApplication } from '@gscwd-api/models';
import {
  LeaveApplicationStatus,
  LeaveApplicationType,
  LeaveDayStatus,
  SickLeaveDetails,
  StudyLeaveDetails,
  VacationLeaveDetails,
} from '@gscwd-api/utils';
import { RpcException } from '@nestjs/microservices';
import { DataSource, EntityManager } from 'typeorm';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { isArray } from 'class-validator';
import { LeaveApplicationDatesService } from '../../leave-application-dates/core/leave-application-dates.service';
import dayjs = require('dayjs');
import { EmployeesService } from '../../../../employees/core/employees.service';
import { OfficerOfTheDayService } from '../../../../officer-of-the-day/core/officer-of-the-day.service';

@Injectable()
export class LeaveApplicationService extends CrudHelper<LeaveApplication> {
  constructor(
    private readonly crudService: CrudService<LeaveApplication>,
    private readonly dataSource: DataSource,
    private readonly client: MicroserviceClient,
    private readonly leaveApplicationDatesService: LeaveApplicationDatesService,
    private readonly employeesService: EmployeesService,
    private readonly officerOfTheDayService: OfficerOfTheDayService
  ) {
    super(crudService);
  }

  async createLeaveApplicationTransaction(transactionEntityManager: EntityManager, createLeaveApplicationDto: CreateLeaveApplicationDto) {
    const { leaveApplicationDates, ...rest } = createLeaveApplicationDto;
    const referenceNo = (await this.rawQuery(`SELECT generate_leave_application_reference_number() referenceNo;`))[0].referenceNo;
    return await this.crudService.transact<LeaveApplication>(transactionEntityManager).create({
      dto: { ...rest, referenceNo },
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async createLeaveApplication(createLeaveApplication: CreateLeaveApplicationDto) {
    //! -- DEPRECATED; CHANGE ;
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

      let supervisorId = null;

      /* UNCOMMENT IF rules change again regarding officer of the day approval
      const employeeAssignmentId = (await this.employeesService.getEmployeeDetails(rest.employeeId)).assignment.id;

      supervisorId = await this.officerOfTheDayService.getOfficerOfTheDayOrgByOrgId(employeeAssignmentId);
      */

      //supervisorId of hrd manager for gm leave application;
      const employeePosition = (await this.employeesService.getEmployeeDetails(rest.employeeId)).assignment.positionTitle;

      //console.log('Employee Leave Application',employeePosition);
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
        forMonetization: false,
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
      } else {
        const { from, to } = leaveApplicationDates;
        leaveApplicationDatesResult = (
          await transactionEntityManager.query(`CALL sp_generate_date_range(?,?,?,?);`, [leaveApplication.employeeId, leaveApplication.id, from, to])
        )[0];
      }
      return {
        leaveApplication,
        leaveApplicationDates: leaveApplicationDatesResult,
        numberOfDays: leaveApplicationDatesResult.length,
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
      throw new HttpException(error.message, error.status);
    }
  }

  async getLeaveApplicationById(id: string) {
    try {
      const leaveApplications = await this.rawQuery<string, LeaveApplicationType[]>(
        `SELECT
        la.employee_id_fk employeeId,
        la.leave_application_id id,
        la.is_late_filing isLateFiling,
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
      throw new HttpException(error.message, error.status);
    }
  }

  async getOngoingLeaveApplicationByEmployeeIdStatus(employeeId: string) {
    try {
      const leaveApplications = await this.rawQuery<string, LeaveApplicationType[]>(
        `SELECT
            la.leave_application_id id,
            lb.leave_name leaveName,
            la.reference_no referenceNo,
            DATE_FORMAT(la.date_of_filing, '%Y-%m-%d %H:%i:%s') dateOfFiling,
            la.is_late_filing isLateFiling,
            la.status \`status\`,
            la.cancel_reason cancelReason,
            DATE_FORMAT(la.cancel_date,'%Y-%m-%d %H:%i:%s') cancelDate 
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
          return { ...leaveApplication, leaveDates: await Promise.all(leaveDates.map(async (leaveDateItem) => leaveDateItem.leaveDate)) };
        })
      );

      return leaveApplicationsWithDates;
    } catch (error) {
      throw new HttpException(error.message, error.status);
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
      throw new HttpException(error.message, error.status);
    }
  }

  async getLeaveApplicationByEmployeeIdStatus(employeeId: string, status: LeaveApplicationStatus) {
    try {
      const leaveApplications = await this.rawQuery<string, LeaveApplicationType[]>(
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
            la.reference_no referenceNo,
            la.is_late_filing isLateFiling,
            DATE_FORMAT(la.cancel_date,'%Y-%m-%d %H:%i%:%s') cancelDate 
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
          WHERE la.employee_id_fk = ? AND la.status = ? 
          ORDER BY la.date_of_filing DESC;`,
        [employeeId, status]
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
      throw new HttpException(error.message, error.status);
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
      throw new HttpException(error.message, error.status);
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
      throw new HttpException(error.message, error.status);
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
      throw new HttpException(error.message, error.status);
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
      throw new HttpException(error.message, error.status);
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
    } else {
      return { employeeDetails, leaveApplicationBasicInfo };
    }
  }

  async getUnavailableDates(employeeId: string) {
    return await this.rawQuery(
      `
      SELECT DISTINCT unavailableDates.unavailableDate \`date\`, type 
      FROM 
      ((SELECT DATE_FORMAT(leave_date, '%Y-%m-%d') AS unavailableDate,'Leave' AS type FROM leave_application la 
        INNER JOIN leave_application_dates lad ON la.leave_application_id=lad.leave_application_id_fk 
        WHERE la.employee_id_fk = ? AND (la.status = 'approved' OR la.status='for hrmo credit certification' OR la.status='for hrdm approval' or la.status='for supervisor approval'))
      UNION 
      (SELECT DATE_FORMAT(holiday_date, '%Y-%m-%d') unavailableDate,'Holiday' AS type FROM holidays 
      WHERE holiday_date BETWEEN DATE_SUB(DATE_SUB(now(), INTERVAL 6 MONTH),INTERVAL 1 DAY) AND DATE_ADD(DATE_ADD(now(), INTERVAL 6 MONTH),INTERVAL 1 DAY))) AS unavailableDates 
      ORDER BY unavailableDates.unavailableDate ASC`,
      [employeeId]
    );
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
    //
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
          { status: LeaveApplicationStatus.FOR_HRDM_APPROVAL },
          { status: LeaveApplicationStatus.APPROVED },
          { status: LeaveApplicationStatus.DISAPPROVED_BY_HRDM },
        ],
        order: { dateOfFiling: 'DESC' },
      },
    });

    const leavesDetails = await Promise.all(
      leaves.map(async (leave) => {
        const { employeeId, supervisorId, hrmoApprovedBy, hrmoApprovalDate, hrdmApprovedBy, hrdmApprovalDate, leaveBenefitsId, ...rest } = leave;
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

        const _hrmoApprovedBy = (await this.employeesService.getEmployeeDetails(hrmoApprovedBy)).employeeFullName;

        const employeeDetails = await this.employeesService.getEmployeeDetails(employeeId);

        const leaveDates = (await this.leaveApplicationDatesService.crud().findAll({
          find: { where: { leaveApplicationId: { id: leave.id } }, select: { leaveDate: true }, order: { leaveDate: 'ASC' } },
        })) as LeaveApplicationDates[];

        const _leaveDates = await Promise.all(
          leaveDates.map(async (leaveDate) => {
            return leaveDate.leaveDate;
          })
        );
        const { employeeName, supervisorName } = employeeSupervisorNames;
        return {
          ...rest,
          leaveBenefitsId: leaveBenefitsId.id,
          leaveName: leaveBenefitsId.leaveName,
          hrmoApprovedBy: _hrmoApprovedBy,
          hrmoApprovalDate,
          hrdmApprovedBy,
          hrdmApprovalDate,
          employee: { employeeId, employeeName, companyId: employeeDetails.companyId },
          supervisor: { supervisorId, supervisorName },
          //leaveName: leaveBenefitsId.leaveName,
          leaveDates: _leaveDates,
        };
      })
    );
    return leavesDetails;
  }

  async getLeavesByLeaveApplicationStatus(leaveApplicationStatus: LeaveApplicationStatus) {
    const leaves = ((<LeaveApplication[]>await this.crud().findAll({
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
            isLateFiling: true,
            supervisorId: true,
            referenceNo: true,
            studyLeaveOther: true,
            outPatient: true,
            cancelDate: true,
            cancelReason: true,
            requestedCommutation: true,
            splWomen: true,
            leaveBenefitsId: { id: true, leaveName: true, leaveType: true },
            status: true,
          },
          relations: { leaveBenefitsId: true },
          where: { status: leaveApplicationStatus },
          order: { dateOfFiling: 'DESC' },
        },
      })) as LeaveApplication[]).map((la) => {
      const { dateOfFiling, cancelDate, ...restOfLeave } = la;
      return {
        dateOfFiling: dayjs(dateOfFiling).format('YYYY-MM-DD'),
        cancelDate: cancelDate === null ? null : dayjs(cancelDate).format('YYYY-MM-DD'),
        ...restOfLeave,
      };
    });

    const leavesDetails = await Promise.all(
      leaves.map(async (leave, idx) => {
        console.log(idx, ' ', leave);
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
        return {
          ...rest,
          leaveBenefitsId: leaveBenefitsId.id,
          leaveName: leaveBenefitsId.leaveName,
          employee: { employeeId, employeeName },
          supervisor: { supervisorId, supervisorName },
          //leaveName: leaveBenefitsId.leaveName,
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
        const { employeeId, leaveBenefitsId, ...rest } = leave;
        const companyId = (await this.employeesService.getEmployeeDetails(employeeId)).companyId;
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
          employee: { employeeId, companyId, employeeName },
          supervisor: { supervisorId, supervisorName },
        };

        // return {
        //   cancelled,
        //   disapproved,
        // };
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

        // return {
        //   cancelled,
        //   disapproved,
        // };
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
        };
      })
    );
    return leavesDetails;
  }
}
