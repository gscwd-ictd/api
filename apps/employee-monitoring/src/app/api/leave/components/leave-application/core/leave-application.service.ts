import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveApplicationDto, LeaveApplicationDates, UpdateLeaveApplicationDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LeaveApplication } from '@gscwd-api/models';
import { LeaveApplicationStatus, LeaveApplicationType, SickLeaveDetails, StudyLeaveDetails, VacationLeaveDetails } from '@gscwd-api/utils';
import { RpcException } from '@nestjs/microservices';
import { DataSource, EntityManager } from 'typeorm';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { isArray } from 'class-validator';
import { LeaveApplicationDatesService } from '../../leave-application-dates/core/leave-application-dates.service';

@Injectable()
export class LeaveApplicationService extends CrudHelper<LeaveApplication> {
  constructor(
    private readonly crudService: CrudService<LeaveApplication>,
    private readonly dataSource: DataSource,
    private readonly client: MicroserviceClient,
    private readonly leaveApplicationDatesService: LeaveApplicationDatesService
  ) {
    super(crudService);
  }

  async createLeaveApplicationTransaction(transactionEntityManager: EntityManager, createLeaveApplicationDto: CreateLeaveApplicationDto) {
    const { leaveApplicationDates, ...rest } = createLeaveApplicationDto;
    return await this.crudService.transact<LeaveApplication>(transactionEntityManager).create({
      dto: rest,
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

      const supervisorId = (await this.client.call<string, string, string>({
        action: 'send',
        payload: rest.employeeId,
        pattern: 'get_employee_supervisor_id',
        onError: (error) => new NotFoundException(error),
      })) as string;

      console.log(supervisorId);

      const leaveApplication = await this.createLeaveApplicationTransaction(transactionEntityManager, {
        ...rest,
        supervisorId,
        dateOfFiling: new Date(now),
        status: LeaveApplicationStatus.ONGOING,
        forMonetization: false,
        leaveApplicationDates,
      });

      let leaveApplicationDatesResult;

      if (isArray(leaveApplicationDates)) {
        leaveApplicationDatesResult = await Promise.all(
          leaveApplicationDates.map(async (leaveDate) => {
            return await this.leaveApplicationDatesService.createApplicationDatesTransaction(transactionEntityManager, {
              leaveDate,
              leaveApplicationId: leaveApplication.id,
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
      const ongoing = await this.getLeaveApplicationByEmployeeIdStatus(employeeId, LeaveApplicationStatus.ONGOING);
      const approved = await this.getLeaveApplicationByEmployeeIdStatus(employeeId, LeaveApplicationStatus.APPROVED);
      const disapproved = await this.getLeaveApplicationByEmployeeIdStatus(employeeId, LeaveApplicationStatus.DISAPPROVED);
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
            la.leave_application_id id,
            lb.leave_name leaveName,
            DATE_FORMAT(la.date_of_filing, '%Y-%m-%d') dateOfFiling,
            la.status \`status\` 
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk 
          WHERE la.leave_application_id = ? 
          ORDER BY la.date_of_filing DESC;`,
        [id]
      );
      let dates = [];
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
            DATE_FORMAT(la.date_of_filing, '%Y-%m-%d') dateOfFiling,
            la.status \`status\` 
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
          WHERE la.employee_id_fk = ? AND la.status = ? 
          ORDER BY la.date_of_filing DESC;`,
        [employeeId, status]
      );
      let dates = [];
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
      console.log(error);
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
    if (leaveName === 'Vacation Leave') {
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
        WHERE la.employee_id_fk = ?  AND (la.status = 'approved' OR la.status='ongoing'))
      UNION 
      (SELECT DATE_FORMAT(holiday_date, '%Y-%m-%d') unavailableDate,'Holiday' AS type  FROM holidays WHERE holiday_date > now())) AS unavailableDates 
      ORDER BY unavailableDates.unavailableDate ASC`,
      [employeeId]
    );
  }

  async getLeavesForHrApproval() {
    return await this.getLeavesByLeaveApplicationStatus(LeaveApplicationStatus.ONGOING);
  }

  async getLeavesByLeaveApplicationStatus(leaveApplicationStatus: LeaveApplicationStatus) {
    const leaves = <LeaveApplication[]>await this.crud().findAll({ find: { where: { status: leaveApplicationStatus } } });

    const leavesDetails = await Promise.all(
      leaves.map(async (leave) => {
        //console.log(leave);
        const { employeeId, supervisorId, ...rest } = leave;
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

        return { ...rest, employee: { employeeId, employeeName }, supervisor: { supervisorId, supervisorName } };
      })
    );
    return leavesDetails;
  }

  async getLeavesUnderSupervisor(supervisorId: string) {
    const leaves = <LeaveApplication[]>await this.crud().findAll({ find: { where: { supervisorId, status: LeaveApplicationStatus.HR_APPROVED } } });

    const leavesDetails = await Promise.all(
      leaves.map(async (leave) => {
        const { employeeId, supervisorId, ...rest } = leave;
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

        return { ...rest, employee: { employeeId, employeeName }, supervisor: { supervisorId, supervisorName } };
      })
    );
    return leavesDetails;
  }
}
