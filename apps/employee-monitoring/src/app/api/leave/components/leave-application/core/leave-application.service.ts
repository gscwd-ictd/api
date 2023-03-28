import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveApplicationDto, LeaveApplicationDates, UpdateLeaveApplicationDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeaveApplication } from '@gscwd-api/models';
import { LeaveApplicationStatus, LeaveApplicationType, VacationLeaveDetails } from '@gscwd-api/utils';
import { RpcException } from '@nestjs/microservices';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class LeaveApplicationService extends CrudHelper<LeaveApplication> {
  constructor(private readonly crudService: CrudService<LeaveApplication>, private readonly dataSource: DataSource) {
    super(crudService);
  }

  async createLeaveApplicationTransaction(transactionEntityManager: EntityManager, updateLeaveApplicationDto: UpdateLeaveApplicationDto) {
    return await this.crudService.transact<LeaveApplication>(transactionEntityManager).create({
      dto: updateLeaveApplicationDto,
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
      const leaveApplication = await this.createLeaveApplicationTransaction(transactionEntityManager, {
        ...rest,
        dateOfFiling: new Date(now),
        status: LeaveApplicationStatus.ONGOING,
        forMonetization: false,
      });

      const leaveApplicationDatesResult = await Promise.all(
        leaveApplicationDates.map(async (leaveDate) => {
          return await transactionEntityManager.getRepository(LeaveApplicationDates).save({
            leaveDate,
            leaveApplicationId: leaveApplication.id,
          });
        })
      );
      return {
        leaveApplication,
        leaveApplicationDates: leaveApplicationDatesResult,
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
      return await this.rawQuery<string, LeaveApplicationType[]>(
        `SELECT
            la.leave_application_id id,
            lb.leave_name leaveName,
            DATE_FORMAT(la.date_of_filing, '%Y-%m-%d') dateOfFiling,
            GROUP_CONCAT(DATE_FORMAT(lad.leave_date, '%Y-%m-%d') SEPARATOR ', ') leaveDates,
            la.status \`status\` 
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
              INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id 
          WHERE la.leave_application_id = ? 
          GROUP BY leave_application_id ORDER BY la.date_of_filing DESC;`,
        [id]
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getLeaveApplicationByEmployeeIdStatus(employeeId: string, status: LeaveApplicationStatus) {
    try {
      return await this.rawQuery<string, LeaveApplicationType[]>(
        `SELECT
            la.leave_application_id id,
            lb.leave_name leaveName,
            DATE_FORMAT(la.date_of_filing, '%Y-%m-%d') dateOfFiling,
            GROUP_CONCAT(DATE_FORMAT(lad.leave_date, '%Y-%m-%d') ORDER BY lad.leave_date ASC SEPARATOR ', ') leaveDates,
            la.status \`status\` 
            FROM leave_application la 
              INNER JOIN leave_benefits lb ON lb.leave_benefits_id = la.leave_benefits_id_fk
              INNER JOIN leave_application_dates lad ON lad.leave_application_id_fk = la.leave_application_id 
          WHERE la.employee_id_fk = ? AND la.status = ? 
          GROUP BY leave_application_id ORDER BY la.date_of_filing DESC;`,
        [employeeId, status]
      );
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

  async getLeaveApplicationDetails(leaveApplicationId: string) {
    const leaveApplicationBasicInfo = await this.getLeaveApplicationById(leaveApplicationId);
    const { leaveName } = leaveApplicationBasicInfo[0];
    console.log(leaveName);
    if (leaveName === 'Vacation Leave') {
      const leaveApplicationDetails = await this.getVacationLeaveDetails(leaveApplicationId);
      return { leaveApplicationBasicInfo, leaveApplicationDetails };
    }
    if (leaveName === 'Sick Leave') {
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
      (SELECT DATE_FORMAT(holiday_date, '%Y-%m-%d') unavailableDate,'Holiday' AS type  FROM holidays WHERE holiday_date > now()) ) AS unavailableDates 
      ORDER BY unavailableDates.unavailableDate ASC`,
      [employeeId]
    );
  }
}
