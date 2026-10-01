import { DtrDeductionType } from '@gscwd-api/utils';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {
  HrUpdatePassSlipTimeRecordDto,
  PassSlip,
  PassSlipApproval,
  PassSlipDto,
  PassSlipHrCancellationDto,
  UpdatePassSlipTimeRecordDto,
} from '@gscwd-api/models';
import { PassSlipApprovalService } from '../components/approval/core/pass-slip-approval.service';
import { MicroserviceClient } from '@gscwd-api/microservices';
import {
  abbreviate,
  LeaveLedger,
  NatureOfBusiness,
  ObTransportation,
  PassSlipApprovalStatus,
  PassSlipForDispute,
  PassSlipForLedger,
} from '@gscwd-api/utils';
import { Between, DataSource, IsNull, Not } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import dayjs = require('dayjs');
import { LeaveCardLedgerDebitService } from '../../leave/components/leave-card-ledger-debit/core/leave-card-ledger-debit.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { OfficerOfTheDayService } from '../../officer-of-the-day/core/officer-of-the-day.service';
import { EmployeeScheduleService } from '../../daily-time-record/components/employee-schedule/core/employee-schedule.service';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { computeDeductibleMinutes, computeUsedMinutes, minutesToCredits, quarterStart, ScheduleWindow } from './pass-slip-deduction.util';

@Injectable()
export class PassSlipService extends CrudHelper<PassSlip> {
  constructor(
    private readonly crudService: CrudService<PassSlip>,
    private readonly passSlipApprovalService: PassSlipApprovalService,
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService,
    private readonly client: MicroserviceClient,
    private readonly employeeService: EmployeesService,
    private readonly officerOfTheDayService: OfficerOfTheDayService,
    private readonly employeeScheduleService: EmployeeScheduleService,
    private readonly dailyTimeRecordService: DailyTimeRecordService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  async addPassSlip(passSlipDto: PassSlipDto) {
    const { natureOfBusiness } = passSlipDto;
    const passSlip = await this.dataSource.transaction(async (transactionEntityManager) => {
      const { approval, supervisorId, isMedical, ...rest } = passSlipDto;
      let status = PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL;

      const passSlipResult = await transactionEntityManager.getRepository(PassSlip).save({ ...rest, isMedical, dateOfApplication: dayjs().toDate() });
      if (natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS) status = PassSlipApprovalStatus.FOR_HRMO_APPROVAL;

      const approvalResult = await transactionEntityManager.getRepository(PassSlipApproval).save({
        passSlipId: passSlipResult,
        supervisorId,
        ...approval,
        status,
      });
      return { passSlipResult, approvalResult };
    });
    return passSlip;
  }

  async getPassSlipsForDispute(employeeId: string) {
    const passSlips = (await this.passSlipApprovalService.rawQuery(
      `SELECT ps.pass_slip_id passSlipId,
              psa.supervisor_id_fk supervisorId, 
              psa.status status,
              ps.employee_id_fk employeeId, 
              ps.time_out timeOut,
              ps.time_in timeIn 
      FROM pass_slip_approval psa 
      INNER JOIN pass_slip ps ON ps.pass_slip_id = psa.pass_slip_id_fk 
      WHERE 
      ((ps.time_in IS NOT NULL AND ps.time_out IS NOT NULL) 
        OR 
      (ps.time_in IS NULL AND ps.time_out IS NOT NULL))
      AND ps.employee_id_fk = ? AND status = ?;`,
      [employeeId, PassSlipApprovalStatus.APPROVED]
    )) as PassSlipForDispute[];

    const passSlipDetails = await Promise.all(
      passSlips.map(async (passSlip) => {
        const names = await this.getSupervisorAndEmployeeNames(passSlip.employeeId, passSlip.supervisorId);

        const assignment = await this.getEmployeeAssignment(passSlip.employeeId);

        const { passSlipId, ...restOfPassSlip } = passSlip;
        return { ...restOfPassSlip, passSlipId, ...names, assignmentName: assignment.assignment.name };
      })
    );
    return passSlipDetails;
  }

  async getPassSlipsBySupervisorId(supervisorId: string) {
    const passSlipsForApproval = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        where: { supervisorId, status: PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL },
        order: { passSlipId: { dateOfApplication: 'ASC' } },
      },
    });

    const forApproval = await Promise.all(
      passSlipsForApproval.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId: passSlip.passSlipId.employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });

        return { ...passSlipId, ...names, ...restOfPassSlip };
      })
    );

    const passSlipsApproved = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        where: { supervisorId, status: PassSlipApprovalStatus.APPROVED },
      },
    });

    const approved = await Promise.all(
      passSlipsApproved.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId: passSlip.passSlipId.employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });

        return { ...passSlipId, ...names, ...restOfPassSlip };
      })
    );

    const passSlipsDisapproved = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        where: { supervisorId, status: PassSlipApprovalStatus.DISAPPROVED },
      },
    });

    const disapproved = await Promise.all(
      passSlipsDisapproved.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId: passSlip.passSlipId.employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });
        return { ...passSlipId, ...names, ...restOfPassSlip };
      })
    );

    const passSlipsCancelled = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        where: { supervisorId, status: PassSlipApprovalStatus.CANCELLED },
      },
    });
    const cancelled = await Promise.all(
      passSlipsCancelled.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId: passSlip.passSlipId.employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });
        return { ...passSlipId, ...names, ...restOfPassSlip };
      })
    );

    return { forApproval, completed: { approved, disapproved, cancelled } };
  }

  async getPassSlipsBySupervisorIdV2(supervisorId: string) {
    const passSlips = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true, hrmoApprovalDate: true, supervisorApprovalDate: true, hrmoDisapprovalRemarks: true },
        where: [
          {
            supervisorId,
            passSlipId: {
              dateOfApplication: Between(
                dayjs(dayjs().subtract(3, 'month').format('YYYY-MM') + '-01').toDate(),
                dayjs(dayjs().add(1, 'day').format('YYYY-MM') + '-' + dayjs().daysInMonth()).toDate()
              ),
            },
          },
        ],
        order: { passSlipId: { dateOfApplication: 'DESC' } },
      },
      onError: () => new NotFoundException(),
    });

    const passSlipsWithDetails = await Promise.all(
      passSlips.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId: passSlip.passSlipId.employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });

        return { ...passSlipId, ...names, ...restOfPassSlip };
      })
    );
    return passSlipsWithDetails;
  }

  async getApprovedPassSlipsByEmployeeId(employeeId: string) {
    const passSlipsApproved = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        where: { passSlipId: { employeeId }, status: PassSlipApprovalStatus.APPROVED },
      },
    });

    const approved = await Promise.all(
      passSlipsApproved.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId: passSlip.passSlipId.employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });

        return { ...passSlipId, ...names, ...restOfPassSlip };
      })
    );
    return approved;
  }

  async getCurrentPassSlipsByEmployeeId(employeeId: string) {
    const passSlipsApproved = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        where: [
          {
            passSlipId: {
              employeeId,
              dateOfApplication: Between(
                dayjs(dayjs().format('YYYY-MM-DD')).subtract(1, 'day').toDate(),
                dayjs(dayjs().format('YYYY-MM-DD')).add(1, 'day').toDate()
              ),
              natureOfBusiness: NatureOfBusiness.PERSONAL,
              timeIn: IsNull(),
            },
            status: PassSlipApprovalStatus.APPROVED,
          },
          {
            passSlipId: {
              employeeId,
              dateOfApplication: Between(
                dayjs(dayjs().format('YYYY-MM-DD')).subtract(1, 'day').toDate(),
                dayjs(dayjs().format('YYYY-MM-DD')).add(1, 'day').toDate()
              ),
              natureOfBusiness: NatureOfBusiness.PERSONAL,
              timeIn: IsNull(),
            },
            status: PassSlipApprovalStatus.AWAITING_MEDICAL_CERTIFICATE,
          },
          {
            passSlipId: {
              employeeId,
              dateOfApplication: Between(
                dayjs(dayjs().format('YYYY-MM-DD')).subtract(1, 'day').toDate(),
                dayjs(dayjs().format('YYYY-MM-DD')).add(1, 'day').toDate()
              ),
              natureOfBusiness: NatureOfBusiness.OFFICIAL_BUSINESS,
              timeIn: IsNull(),
            },
            status: PassSlipApprovalStatus.APPROVED,
          },
          {
            passSlipId: {
              employeeId,
              dateOfApplication: Between(
                dayjs(dayjs().format('YYYY-MM-DD')).subtract(1, 'day').toDate(),
                dayjs(dayjs().format('YYYY-MM-DD')).add(1, 'day').toDate()
              ),
              timeOut: IsNull(),
              natureOfBusiness: NatureOfBusiness.HALF_DAY,
            },
            status: PassSlipApprovalStatus.APPROVED,
          },
          {
            passSlipId: {
              employeeId,
              dateOfApplication: Between(
                dayjs(dayjs().format('YYYY-MM-DD')).subtract(1, 'day').toDate(),
                dayjs(dayjs().format('YYYY-MM-DD')).add(1, 'day').toDate()
              ),
              natureOfBusiness: NatureOfBusiness.UNDERTIME,
              timeOut: IsNull(),
            },
            status: PassSlipApprovalStatus.APPROVED,
          },
        ],
      },
    });

    const approved = await Promise.all(
      passSlipsApproved.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId: passSlip.passSlipId.employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });

        const { dateOfApplication, ...restOfPassSlipId } = passSlipId;

        return { dateOfApplication: dayjs(dateOfApplication).format('YYYY-MM-DD'), ...restOfPassSlipId, ...names, ...restOfPassSlip };
      })
    );

    return approved;
  }

  async getPassSlipsByEmployeeId(employeeId: string) {
    const passSlipsForApproval = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true, hrmoApprovalDate: true, hrmoDisapprovalRemarks: true, supervisorApprovalDate: true },
        where: [
          { passSlipId: { employeeId }, status: PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL },
          { passSlipId: { employeeId }, status: PassSlipApprovalStatus.FOR_HRMO_APPROVAL },
        ],
        order: { createdAt: 'DESC' },
      },
    });

    const forApproval = await Promise.all(
      passSlipsForApproval.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId: passSlip.passSlipId.employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });

        return { ...passSlipId, ...names, ...restOfPassSlip };
      })
    );

    const passSlipsApprovedDisapprovedForDispute = (await this.rawQuery(
      `
      SELECT 
        psa.created_at createdAt,
        psa.updated_at updatedAt,
        psa.deleted_at deletedAt,
        ps.pass_slip_id id,
        ps.employee_id_fk employeeId,
        psa.supervisor_id_fk supervisorId, 
        ps.is_medical isMedical,
        psa.status status,
        DATE_FORMAT(ps.date_of_application,'%Y-%m-%d %H:%i:%s') dateOfApplication,
        nature_of_business natureOfBusiness, 
        ob_transportation obTransportation, 
        DATE_FORMAT(psa.supervisor_approval_date,'%Y-%m-%d %H:%i:%s') supervisorApprovalDate,
        estimate_hours estimateHours,
        purpose_destination purposeDestination,
        time_in timeIn,
        time_out timeOut,
        ps.is_dispute_approved isDisputeApproved,
        ps.dispute_remarks disputeRemarks,
        ps.encoded_time_in encodedTimeIn,
        ps.encoded_time_out encodedTimeOut,
        ps.is_deductible_to_pay isDeductibleToPay, 
        is_cancelled isCancelled,
        DATE_FORMAT(psa.hrmo_approval_date,'%Y-%m-%d %H:%i:%s') hrmoApprovalDate,
        hrmo_disapproval_remarks hrmoDisapprovalRemarks
      FROM pass_slip_approval psa 
        INNER JOIN pass_slip ps ON ps.pass_slip_id = psa.pass_slip_id_fk 
      WHERE ps.employee_id_fk = ? AND 
      (
        status = 'approved' 
        OR status = 'disapproved' 
        OR status = 'for dispute' 
        OR status = 'cancelled' 
        OR status = 'awaiting medical certificate' 
        OR status = 'approved with medical certificate' 
        OR status = 'approved without medical certificate'
        OR status = 'disapproved by hrmo' 
        OR status = 'disapproved' 
        OR status = 'unused'
      ) 
      ORDER BY ps.date_of_application DESC,psa.status ASC;  
    `,
      [employeeId]
    )) as {
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date;
      id: string;
      employeeId: string;
      supervisorId: string;
      status: PassSlipApprovalStatus;
      natureOfBusiness: NatureOfBusiness;
      obTransportation: ObTransportation;
      estimateHours: number;
      purposeDestination: string;
      timeIn: number;
      timeOut: number;
      isDisputeApproved: boolean;
      disputeRemarks: string;
      isMedical: boolean;
      encodedTimeIn: number;
      encodedTimeOut: number;
      isCancelled: boolean;
      supervisorApprovalDate: Date;
      hrmoApprovalDate: Date;
      isDeductibleToPay: boolean;
      hrmoDisapprovalRemarks: string;
    }[];

    const approvedDisapproved = await Promise.all(
      passSlipsApprovedDisapprovedForDispute.map(async (passSlip) => {
        const { ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });
        return { ...names, ...restOfPassSlip, isDeductibleToPay: !!restOfPassSlip.isDeductibleToPay };
      })
    );

    const allowedToApplyForNew = (await this.getCurrentPassSlipsByEmployeeId(employeeId)).length > 0 ? false : true;
    const passSlips = { forApproval, completed: approvedDisapproved, allowedToApplyForNew };
    return passSlips;
  }

  private async getSupervisorAndEmployeeNames(employeeId: string, supervisorId: string) {
    const names = (await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
      action: 'send',
      payload: { employeeId, supervisorId },
      pattern: 'get_employee_supervisor_names',
      onError: (error) => new NotFoundException(error),
    })) as {
      employeeName: string;
      employeeSignature: string;
      supervisorName: string;
      supervisorSignature: string;
    };
    return names;
  }

  async getAllPassSlips() {
    const passSlips = <PassSlipApproval[]>await this.passSlipApprovalService
      .queryBuilder('t')
      .addSelect('supervisor_id_fk', 'supervisorId')
      .addSelect('pass_slip_id_fk', 'passSlipId')
      .addSelect('status', 'status')
      .addSelect(`DATE_FORMAT(t.created_at,'%m')`, 'dateApplied')
      .orderBy('t.created_at', 'DESC')
      .addOrderBy('status', 'ASC')
      .leftJoinAndSelect('t.passSlipId', 'passSlipId')
      .where(`DATE_FORMAT(t.created_at,'%Y-%m-%d') = :dateApplied`, { dateApplied: dayjs().format('YYYY-MM-DD').toString() })
      .getMany();

    const passSlipDetails = await Promise.all(
      passSlips.map(async (passSlip) => {
        const names = await this.getSupervisorAndEmployeeNames(passSlip.passSlipId.employeeId, passSlip.supervisorId);
        const employeeDetails = await this.employeeService.getBasicEmployeeDetails(passSlip.passSlipId.employeeId);

        const { passSlipId, ...restOfPassSlip } = passSlip;
        const { dateOfApplication, ...restOfPassSlipId } = passSlipId;
        return {
          ...restOfPassSlip,
          dateOfApplication: dayjs(dateOfApplication).format('YYYY-MM-DD'),
          ...restOfPassSlipId,
          ...names,
          avatarUrl: employeeDetails.photoUrl,
          assignmentName: employeeDetails.assignment.name,
        };
      })
    );
    return passSlipDetails;
  }

  async getPassSlipsByYearMonth(yearMonth: string) {
    dayjs(yearMonth + '-01').format('YYYY-MM');
    const passSlips = <PassSlipApproval[]>await this.passSlipApprovalService
      .queryBuilder('t')
      .addSelect('supervisor_id_fk', 'supervisorId')
      .addSelect('pass_slip_id_fk', 'passSlipId')
      .addSelect('status', 'status')
      .addSelect(`DATE_FORMAT(t.created_at,'%m')`, 'dateApplied')
      .orderBy('t.created_at', 'DESC')
      .addOrderBy('status', 'ASC')
      .leftJoinAndSelect('t.passSlipId', 'passSlipId')
      .where(`DATE_FORMAT(t.created_at,'%Y-%m') = :yearMonth`, { yearMonth: dayjs(yearMonth + '-01').format('YYYY-MM') })
      .getMany();

    const passSlipDetails = await Promise.all(
      passSlips.map(async (passSlip) => {
        let employeeId;
        try {
          employeeId = passSlip.passSlipId.employeeId;
          const names = await this.getSupervisorAndEmployeeNames(passSlip.passSlipId.employeeId, passSlip.supervisorId);
          const employeeDetails = await this.employeeService.getBasicEmployeeDetails(passSlip.passSlipId.employeeId);

          const { passSlipId, ...restOfPassSlip } = passSlip;
          const { dateOfApplication, ...restOfPassSlipId } = passSlipId;
          return {
            ...restOfPassSlip,
            dateOfApplication: dayjs(dateOfApplication).format('YYYY-MM-DD'),
            ...restOfPassSlipId,
            ...names,
            avatarUrl: employeeDetails.photoUrl,
            assignmentName: employeeDetails.assignment.name,
          };
        } catch (error) {
          console.log(employeeId);
          return null;
        }
      })
    );

    return passSlipDetails;
  }

  async getAllOngoingPassSlips() {
    const passSlips = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        order: { createdAt: 'DESC', status: 'ASC' },
        where: [{ passSlipId: { timeIn: Not(IsNull()), timeOut: IsNull() } }, { passSlipId: { timeIn: IsNull(), timeOut: IsNull() } }],
      },
    });

    const passSlipDetails = await Promise.all(
      passSlips.map(async (passSlip) => {
        const names = await this.getSupervisorAndEmployeeNames(passSlip.passSlipId.employeeId, passSlip.supervisorId);

        const assignment = await this.getEmployeeAssignment(passSlip.passSlipId.employeeId);

        const { passSlipId, ...restOfPassSlip } = passSlip;
        return { ...restOfPassSlip, ...passSlipId, ...names, assignmentName: assignment.assignment.name };
      })
    );
    return passSlipDetails;
  }

  private async getEmployeeAssignment(employeeId: string) {
    const assignment = (await this.client.call<string, string, object>({
      action: 'send',
      payload: employeeId,
      pattern: 'find_employee_ems',
      onError: (error) => new NotFoundException(error),
    })) as {
      userId: string;
      companyId: string;
      assignment: { id: string; name: string; positionId: string; positionTitle: string; salary: string };
      userRole: string;
    };
    return assignment;
  }

  async getPassSlipDetails(passSlipId: string) {
    const passSlip = (
      await this.rawQuery(
        `
    SELECT 
    ps.pass_slip_id id, 
      date_of_application dateOfApplication, 
      nature_of_business natureOfBusiness, 
      ob_transportation obTransportation, 
    estimate_hours estimateHours,
      purpose_destination purposeDestination,
      time_out timeOut,
      time_in timeIn,
      employee_id_fk employeeId,
      supervisor_id_fk supervisorId
  FROM pass_slip ps 
  INNER JOIN pass_slip_approval psa ON ps.pass_slip_id = psa.pass_slip_id_fk 
  WHERE ps.pass_slip_id = ?;`,
        [passSlipId]
      )
    )[0];

    const { employeeId, supervisorId, ...rest } = passSlip;
    const employeeAssignment = await this.getEmployeeAssignment(employeeId);
    const employeeSupervisorNames = await this.getSupervisorAndEmployeeNames(employeeId, supervisorId);
    const { employeeName, employeeSignature, supervisorName, supervisorSignature } = employeeSupervisorNames;
    return {
      ...rest,
      employee: { name: employeeName, signature: employeeSignature },
      supervisor: { name: supervisorName, signature: supervisorSignature },
      assignment: abbreviate(employeeAssignment.assignment.name),
    };
  }

  async deletePassSlip(id: string) {
    const passSlip = await this.getPassSlip(id);
    const deletePassSlipApprovalResults = await this.passSlipApprovalService.crud().delete({ deleteBy: { passSlipId: { id } }, softDelete: false });
    const deletePassSlipResult = await this.crud().delete({ deleteBy: { id }, softDelete: false });
    if (deletePassSlipApprovalResults.affected > 0 && deletePassSlipResult.affected > 0) return passSlip;
  }

  async getPassSlip(id: string) {
    return await this.crudService.findOne({
      find: { where: { id } },
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async updatePassSlipTimeRecord(updatePassSlipTimeRecordDto: UpdatePassSlipTimeRecordDto) {
    const { id, action } = updatePassSlipTimeRecordDto;
    const timeNow = dayjs().format('HH:mm:ss');
    let timeIn = null,
      timeOut = null;
    action === 'time in' ? (timeIn = timeNow) : (timeOut = timeNow);
    let updateResult = null;

    if (action === 'time in') {
      updateResult = await this.crud().update({
        dto: { id, timeIn },
        updateBy: { id },
        onError: () => new InternalServerErrorException(),
      });
    } else {
      const passSlipDetails = await this.getPassSlip(id);
      const { employeeId, natureOfBusiness, dateOfApplication } = passSlipDetails;
      updateResult = await this.crud().update({
        dto: { id, timeOut },
        updateBy: { id },
        onError: () => new InternalServerErrorException(),
      });

      if (natureOfBusiness === NatureOfBusiness.UNDERTIME || natureOfBusiness === NatureOfBusiness.HALF_DAY) {
        const companyId = await this.employeeService.getCompanyId(employeeId);
        //patch to dtr ;set has correction to 1
        await this.rawQuery(`UPDATE daily_time_record SET time_out = ?,has_correction = 1 WHERE company_id_fk=? AND dtr_date=?;`, [
          timeOut,
          companyId,
          dayjs(dateOfApplication).format('YYYY-MM-DD'),
        ]);
      }
    }
    if (updateResult.affected > 0) return updatePassSlipTimeRecordDto;
  }

  async cancelPassSlip(passSlipHrCancellationDto: PassSlipHrCancellationDto) {
    const { passSlipId } = passSlipHrCancellationDto;
    const result = await this.passSlipApprovalService
      .crud()
      .update({ dto: { status: PassSlipApprovalStatus.CANCELLED }, updateBy: { passSlipId }, onError: () => new InternalServerErrorException() });
    if (result.affected > 0) return { ...passSlipHrCancellationDto, status: PassSlipApprovalStatus.CANCELLED };
  }

  async hrUpdatePassSlipTimeLog(hrUpdatePassSlipTimeRecordDto: HrUpdatePassSlipTimeRecordDto) {
    const { id, timeIn, timeOut } = hrUpdatePassSlipTimeRecordDto;
    const result = await this.crud().update({
      dto: { timeIn, timeOut },
      updateBy: { id },
    });
  }

  // ---------------------------------------------------------------------------
  // PASS SLIP END-OF-DAY / LEDGER PROCESSING
  //
  // 23:45  updatePassSlipStatusCron  -> today's slips with no time logs become UNUSED / CANCELLED
  // 23:50  updateMedicalPassSlips    -> 'awaiting medical certificate' after 3 weekdays -> 'approved without medical certificate'
  // 23:55  addPassSlipsToLedger      -> after the 3-weekday dispute window: auto-fill missing pass slip IN
  //                                     with schedule time out, then post the leave ledger debit
  // ---------------------------------------------------------------------------

  /** Working days an employee has to dispute a pass slip before it is finalized. */
  private static readonly DISPUTE_WINDOW_WORKING_DAYS = 3;
  /** How far back the ledger cron looks for slips it may have missed (e.g. server down, dispute resolved late). */
  private static readonly LEDGER_CATCH_UP_DAYS = 30;

  private readonly passSlipSelect = `
        ps.pass_slip_id id,
        ps.employee_id_fk employeeId,
        ps.date_of_application dateOfApplication,
        ps.nature_of_business natureOfBusiness,
        ps.time_in timeIn,
        ps.time_out timeOut,
        ps.is_medical isMedical,
        ps.encoded_time_in encodedTimeIn,
        ps.encoded_time_out encodedTimeOut,
        ps.ob_transportation obTransportation,
        ps.estimate_hours estimateHours,
        ps.purpose_destination purposeDestination,
        ps.is_cancelled isCancelled,
        ps.dispute_remarks disputeRemarks,
        ps.is_dispute_approved isDisputeApproved,
        ps.is_deductible_to_pay isDeductibleToPay,
        psa.status status,
        ps.created_at createdAt,
        ps.updated_at updatedAt,
        ps.deleted_at deletedAt`;

  @Cron('0 45 23 * * 0-6')
  async updatePassSlipStatusCron() {
    await this.updatePassSlipStatusByDate(dayjs().format('YYYY-MM-DD'));
  }

  /** Rule 2.2: both time logs empty at end of day -> UNUSED (approved) or CANCELLED (never approved). */
  async updatePassSlipStatusByDate(dateString: string) {
    const passSlips = (await this.rawQuery(
      `SELECT ${this.passSlipSelect}
         FROM pass_slip ps
        INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
        WHERE DATE_FORMAT(ps.date_of_application,'%Y-%m-%d') = DATE_FORMAT(?,'%Y-%m-%d')
          AND ps.time_out IS NULL AND ps.time_in IS NULL
          AND psa.status IN ('approved','awaiting medical certificate','for supervisor approval','for hrmo approval');`,
      [dateString]
    )) as PassSlipForLedger[];

    for (const { id, status } of passSlips) {
      try {
        const newStatus =
          status === PassSlipApprovalStatus.APPROVED || status === PassSlipApprovalStatus.AWAITING_MEDICAL_CERTIFICATE
            ? PassSlipApprovalStatus.UNUSED
            : PassSlipApprovalStatus.CANCELLED;
        await this.passSlipApprovalService.crud().update({ dto: { status: newStatus }, updateBy: { passSlipId: { id } } });
      } catch (error) {
        console.error(`[pass-slip] status update failed for ${id}:`, error);
      }
    }
    console.log(`-------------- PASS SLIP STATUS CRON DONE (${passSlips.length}) --------------------`);
    return { processed: passSlips.length };
  }

  /** Rule 2.4.3: still awaiting medical certificate after 3 weekdays -> approved without medical certificate (VL). */
  @Cron('0 50 23 * * 0-6')
  async updateMedicalPassSlips() {
    const passSlips = (await this.rawQuery(
      `SELECT ps.pass_slip_id id
         FROM pass_slip ps
        INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
        WHERE get_nth_working_day_after(ps.date_of_application, ?) <= DATE_FORMAT(now(),'%Y-%m-%d')
          AND psa.status = 'awaiting medical certificate';`,
      [PassSlipService.DISPUTE_WINDOW_WORKING_DAYS]
    )) as { id: string }[];

    for (const { id } of passSlips) {
      try {
        await this.passSlipApprovalService
          .crud()
          .update({ dto: { status: PassSlipApprovalStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE }, updateBy: { passSlipId: { id } } });
      } catch (error) {
        console.error(`[pass-slip] medical status update failed for ${id}:`, error);
      }
    }
  }

  @Cron('0 55 23 * * 0-6')
  async addPassSlipsToLedger() {
    return await this.postPassSlipsToLedger({ asOf: dayjs().format('YYYY-MM-DD') });
  }

  /** Manual: process slips whose 3-weekday dispute window ends on the given date. */
  async addPassSlipsToLedgerManually2DaysFromSpecifiedDate(dateFiled: Date) {
    return await this.postPassSlipsToLedger({ asOf: dayjs(dateFiled).format('YYYY-MM-DD') });
  }

  /** Manual: process slips filed on a specific date (ignores the dispute window). */
  async addPassSlipsToLedgerManually(date: string) {
    return await this.postPassSlipsToLedger({ dateOfApplication: dayjs(date).format('YYYY-MM-DD') });
  }

  private async postPassSlipsToLedger(filter: { asOf?: string; dateOfApplication?: string }) {
    const where = filter.dateOfApplication
      ? `DATE_FORMAT(ps.date_of_application,'%Y-%m-%d') = ?`
      : `get_nth_working_day_after(ps.date_of_application, ${PassSlipService.DISPUTE_WINDOW_WORKING_DAYS}) <= ?
         AND ps.date_of_application >= DATE_SUB(?, INTERVAL ${PassSlipService.LEDGER_CATCH_UP_DAYS} DAY)`;
    const params = filter.dateOfApplication ? [filter.dateOfApplication] : [filter.asOf, filter.asOf];

    // ordered so Wellness Pass quarter usage accumulates in filing order
    const passSlips = (await this.rawQuery(
      `SELECT ${this.passSlipSelect}
         FROM pass_slip ps
        INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
        WHERE ${where}
          AND ps.time_out IS NOT NULL
          AND psa.status IN ('approved','approved with medical certificate','approved without medical certificate')
          AND NOT EXISTS (SELECT 1 FROM leave_card_ledger_debit l WHERE l.pass_slip_id_fk = ps.pass_slip_id)
        ORDER BY ps.date_of_application ASC, ps.created_at ASC;`,
      params
    )) as PassSlipForLedger[];

    let posted = 0;
    const failed: string[] = [];
    // sequential on purpose: Wellness Pass allowance depends on earlier slips in the quarter
    for (const passSlip of passSlips) {
      try {
        if (await this.finalizePassSlip(passSlip)) posted++;
      } catch (error) {
        failed.push(passSlip.id);
        console.error(`[pass-slip] ledger posting failed for ${passSlip.id}:`, error);
      }
    }
    console.log(`-------------- PASS SLIP LEDGER CRON DONE: ${posted} posted, ${failed.length} failed of ${passSlips.length} --------------------`);
    return { processed: passSlips.length, posted, failed };
  }

  /** Schedule in effect for the employee on a date: DTR schedule first, else assigned schedule. */
  private async getScheduleForDate(employeeId: string, companyId: string, date: string) {
    const dtr = (await this.rawQuery(
      `SELECT dtr.daily_time_record_id dtrId, dtr.time_out dtrTimeOut, s.schedule_id scheduleId,
              s.time_in timeIn, s.time_out timeOut, s.lunch_out lunchOut, s.lunch_in lunchIn
         FROM daily_time_record dtr
        INNER JOIN schedule s ON dtr.schedule_id_fk = s.schedule_id
        WHERE DATE_FORMAT(dtr.dtr_date,'%Y-%m-%d') = ? AND dtr.company_id_fk = ?
        LIMIT 1;`,
      [date, companyId]
    )) as { dtrId: string; dtrTimeOut: string | null; scheduleId: string; timeIn: string; timeOut: string; lunchOut: string; lunchIn: string }[];
    if (dtr.length > 0) return { dtr: dtr[0], schedule: dtr[0] as ScheduleWindow & { scheduleId: string } };

    const { schedule } = (await this.employeeScheduleService.getEmployeeScheduleByDtrDate(employeeId, dayjs(date).toDate())) as {
      schedule: { id?: string; timeIn?: string; timeOut?: string; lunchOut?: string; lunchIn?: string };
    };
    if (!schedule || !schedule.timeIn || !schedule.timeOut) return { dtr: null, schedule: null };
    return {
      dtr: null,
      schedule: {
        scheduleId: schedule.id,
        timeIn: schedule.timeIn,
        timeOut: schedule.timeOut,
        lunchOut: schedule.lunchOut,
        lunchIn: schedule.lunchIn,
      },
    };
  }

  /** Wellness Pass minutes already used by this employee earlier in the same quarter (lunch excluded). */
  private async getWellnessMinutesUsedBefore(passSlip: PassSlipForLedger, companyId: string) {
    const earlier = (await this.rawQuery(
      `SELECT ps.pass_slip_id id, ps.date_of_application dateOfApplication, ps.time_out timeOut, ps.time_in timeIn
         FROM pass_slip ps
        INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
        WHERE ps.employee_id_fk = ?
          AND ps.nature_of_business = ?
          AND ps.time_out IS NOT NULL
          AND psa.status IN ('approved','approved with medical certificate','approved without medical certificate')
          AND ps.date_of_application >= ?
          AND (ps.date_of_application < ? OR (ps.date_of_application = ? AND ps.created_at < ?))
          AND ps.pass_slip_id <> ?;`,
      [
        passSlip.employeeId,
        NatureOfBusiness.WELLNESS_PASS,
        quarterStart(passSlip.dateOfApplication),
        passSlip.dateOfApplication,
        passSlip.dateOfApplication,
        passSlip.createdAt,
        passSlip.id,
      ]
    )) as { id: string; dateOfApplication: Date; timeOut: string; timeIn: string | null }[];

    let used = 0;
    for (const slip of earlier) {
      const { schedule } = await this.getScheduleForDate(passSlip.employeeId, companyId, dayjs(slip.dateOfApplication).format('YYYY-MM-DD'));
      if (!schedule) continue;
      used += computeUsedMinutes({ natureOfBusiness: NatureOfBusiness.WELLNESS_PASS, timeOut: slip.timeOut, timeIn: slip.timeIn, schedule });
    }
    return used;
  }

  /**
   * Finalize one pass slip after its dispute window:
   *  - auto-fill missing pass slip IN with the schedule time out (rule 2.3.1)
   *  - fill a missing DTR time out (never overwrites a biometric punch)
   *  - compute deductible minutes and post the ledger debit (3 decimals, rounded up)
   * Returns true if a debit was posted.
   */
  private async finalizePassSlip(passSlip: PassSlipForLedger): Promise<boolean> {
    const { id, employeeId, natureOfBusiness, timeOut } = passSlip;
    const date = dayjs(passSlip.dateOfApplication).format('YYYY-MM-DD');
    const companyId = (await this.employeeService.getEmployeeDetails(employeeId)).companyId;

    const { dtr, schedule } = await this.getScheduleForDate(employeeId, companyId, date);
    if (!schedule) {
      console.warn(`[pass-slip] no schedule for employee ${employeeId} on ${date}; skipped ${id}`);
      return false;
    }

    // 1. no pass slip IN within the dispute window -> use schedule time out
    const originalTimeIn = passSlip.timeIn;
    const timeIn = originalTimeIn ?? schedule.timeOut;
    if (originalTimeIn === null) {
      await this.crud().update({ dto: { timeIn: timeIn as unknown as number }, updateBy: { id } });
    }

    // 2. employee never came back -> make sure the DTR has a time out
    if (originalTimeIn === null) {
      // Official Business = still working -> schedule time out; others left at pass slip time out
      const dtrTimeOut = natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS ? schedule.timeOut : timeOut;
      if (!dtr) {
        await this.dailyTimeRecordService.crud().create({
          dto: { companyId, dtrDate: date, scheduleId: schedule.scheduleId, timeOut: dtrTimeOut as unknown as number, hasCorrection: true } as never,
        });
      } else if (dtr.dtrTimeOut === null) {
        await this.rawQuery(`UPDATE daily_time_record SET time_out = ?, has_correction = 1 WHERE daily_time_record_id = ?;`, [dtrTimeOut, dtr.dtrId]);
      }
    }

    // 3. this pass slip accounts for leaving early -> drop any DTR undertime / half day debit for the
    //    same day so the employee is not deducted twice (phone app + face scanner)
    const coversDtrTimeOut =
      natureOfBusiness === NatureOfBusiness.UNDERTIME ||
      natureOfBusiness === NatureOfBusiness.HALF_DAY ||
      ((natureOfBusiness === NatureOfBusiness.PERSONAL || natureOfBusiness === NatureOfBusiness.WELLNESS_PASS) && originalTimeIn === null);
    if (coversDtrTimeOut) {
      await this.rawQuery(
        `DELETE lcld FROM leave_card_ledger_debit lcld
           INNER JOIN daily_time_record dtr ON dtr.daily_time_record_id = lcld.daily_time_record_id_fk
          WHERE dtr.company_id_fk = ? AND DATE_FORMAT(dtr.dtr_date,'%Y-%m-%d') = ?
            AND lcld.dtr_deduction_type IN (?, ?);`,
        [companyId, date, DtrDeductionType.UNDERTIME, DtrDeductionType.HALFDAY]
      );
    }

    // 4. no leave credit deduction for Official Business or job order / contract of service
    if (natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS) return false;
    const natureOfAppointment = await this.employeeService.getEmployeeNatureOfAppointment(employeeId);
    if (natureOfAppointment === 'job order' || natureOfAppointment === 'cos jo') return false;

    const wellnessMinutesUsedThisQuarter =
      natureOfBusiness === NatureOfBusiness.WELLNESS_PASS ? await this.getWellnessMinutesUsedBefore(passSlip, companyId) : 0;

    const deductibleMinutes = computeDeductibleMinutes({
      natureOfBusiness,
      timeOut: timeOut as unknown as string,
      timeIn: timeIn as unknown as string,
      schedule,
      wellnessMinutesUsedThisQuarter,
    });
    const debitValue = minutesToCredits(deductibleMinutes);
    if (debitValue <= 0) return false;

    // VL vs SL is resolved by sp_generate_leave_ledger_view from nature_of_business, is_medical and status
    await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
      passSlipId: { ...passSlip, timeIn: timeIn as unknown as number } as never,
      debitValue,
    });
    return true;
  }

  async getUsedPassSlipsCountByEmployeeId(employeeId: string) {
    try {
      return {
        passSlipCount: parseInt(
          (
            await this.rawQuery(
              `
              SELECT count(pass_slip_id) usedPassSlipCount FROM pass_slip ps 
                INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id 
              WHERE ps.time_in IS NOT NULL AND ps.time_out IS NOT NULL 
              AND year(date_of_application) = year(now()) 
              AND month(date_of_application) = month(now()) 
              AND ps.employee_id_fk = ?;
      `,
              [employeeId]
            )
          )[0].usedPassSlipCount
        ),
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAssignableSupervisorForPassSlip(employeeData: { orgId: string; employeeId: string }) {
    const employeeTempAssignment = (await this.rawQuery(
      `SELECT organization_id_fk orgId FROM ${process.env.HRMS_DB_NAME}employee_temporary_assignment WHERE employee_id_fk = ?`,
      [employeeData.employeeId]
    )) as { orgId: string }[];

    let officerOfTheDayId = await this.officerOfTheDayService.getOfficerOfTheDayOrgByOrgId(
      employeeTempAssignment.length > 0 ? employeeTempAssignment[0].orgId : employeeData.orgId
    );
    const employeeDetails = await this.employeeService.getBasicEmployeeDetails(employeeData.employeeId);
    const employeeAssignment = employeeDetails.assignment.name;
    const userRole = (await this.employeeService.getEmployeeDetails(employeeData.employeeId)).userRole;
    if (userRole === 'division_manager' || userRole === 'department_manager' || userRole === 'assistant_general_manager') {
      const supervisorId = await this.employeeService.getEmployeeSupervisorId(employeeData.employeeId);
      const supervisorOrgId = (await this.employeeService.getEmployeeDetails(supervisorId)).assignment.id;
      officerOfTheDayId = await this.officerOfTheDayService.getOfficerOfTheDayOrgByOrgId(supervisorOrgId);
      if (officerOfTheDayId === null && userRole === 'department_manager')
        officerOfTheDayId = await this.officerOfTheDayService.getOfficerOfTheDayOrgByOrgId(employeeDetails.assignment.id);
    }
    let officerOfTheDayName: string;
    if (officerOfTheDayId) officerOfTheDayName = (await this.employeeService.getEmployeeDetails(officerOfTheDayId)).employeeFullName;
    const employeeSupervisorId = await this.employeeService.getEmployeeSupervisorId(employeeData.employeeId);
    const employeeSupervisorName = (await this.employeeService.getEmployeeDetails(employeeSupervisorId)).employeeFullName;
    const supervisorAndOfficerOfTheDayArray =
      officerOfTheDayId !== null
        ? [
            { label: officerOfTheDayName, value: officerOfTheDayId },
            { label: employeeSupervisorName, value: employeeSupervisorId },
          ]
        : [{ label: employeeSupervisorName, value: employeeSupervisorId }];
    const supervisoryEmployees = await this.employeeService.getSupervisoryEmployeesForDropdown(employeeData.employeeId);
    const result = [
      ...supervisorAndOfficerOfTheDayArray,
      ...supervisoryEmployees,
      employeeAssignment === 'Building and Grounds, Transportation and Water Meter Maintenance Division'
        ? {
            label: 'Tampico, Agnes P. , MPA',
            value: '010a0d3a-5b3d-11ed-a08b-000c29f95a80',
          }
        : null,
      { label: 'Pe, Charlene Marie D. ', value: 'af7bbec8-b26e-11ed-a79b-000c29f95a80' },
    ];
    return result
      .filter((n) => n)
      .filter((value, index, self) => index === self.findIndex((item) => item.label === value.label && item.value === value.value));
  }
}
