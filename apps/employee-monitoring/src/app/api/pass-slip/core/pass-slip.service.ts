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
import { NatureOfBusiness, ObTransportation, PassSlipApprovalStatus, PassSlipForDispute, PassSlipForLedger } from '@gscwd-api/utils';
import { Between, DataSource, IsNull, Not } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import dayjs = require('dayjs');
import { LeaveCardLedgerDebitService } from '../../leave/components/leave-card-ledger-debit/core/leave-card-ledger-debit.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { OfficerOfTheDayService } from '../../officer-of-the-day/core/officer-of-the-day.service';

@Injectable()
export class PassSlipService extends CrudHelper<PassSlip> {
  constructor(
    private readonly crudService: CrudService<PassSlip>,
    private readonly passSlipApprovalService: PassSlipApprovalService,
    private readonly leaveCardLedgerDebitService: LeaveCardLedgerDebitService,
    private readonly client: MicroserviceClient,
    private readonly employeeService: EmployeesService,
    private readonly officerOfTheDayService: OfficerOfTheDayService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  async addPassSlip(passSlipDto: PassSlipDto) {
    const { natureOfBusiness } = passSlipDto;
    const passSlip = await this.dataSource.transaction(async (transactionEntityManager) => {
      const { approval, supervisorId, ...rest } = passSlipDto;

      const employeeAssignmentId = (await this.employeeService.getEmployeeDetails(rest.employeeId)).assignment.id;

      //let supervisorId = await this.officerOfTheDayService.getOfficerOfTheDayOrgByOrgId(employeeAssignmentId);

      //console.log('supervisor id', supervisorId);

      // if (supervisorId === null) {
      //   supervisorId = (await this.client.call<string, string, string>({
      //     action: 'send',
      //     payload: rest.employeeId,
      //     pattern: 'get_employee_supervisor_id',
      //     onError: (error) => new NotFoundException(error),
      //   })) as string;
      // }

      let status = PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL;
      const passSlipResult = await transactionEntityManager.getRepository(PassSlip).save({ ...rest, dateOfApplication: dayjs().toDate() });
      if (natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS) status = PassSlipApprovalStatus.FOR_HRMO_APPROVAL;

      const approvalResult = await transactionEntityManager
        .getRepository(PassSlipApproval)
        .save({ passSlipId: passSlipResult, supervisorId, ...approval, status });
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
        where: { supervisorId },
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
              timeIn: IsNull(),
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
    //return passSlips;
  }

  async getPassSlipsByEmployeeId(employeeId: string) {
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

    const passSlipsForApproval = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
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
        is_cancelled isCancelled
      FROM pass_slip_approval psa 
        INNER JOIN pass_slip ps ON ps.pass_slip_id = psa.pass_slip_id_fk 
      WHERE ps.employee_id_fk = ? AND (status = 'approved' OR status = 'disapproved' OR status = 'for dispute') 
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
      encodedTimeIn: number;
      isCancelled: boolean;
      supervisorApprovalDate: Date;
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
        return { ...names, ...restOfPassSlip };
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
    const passSlips = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        order: { createdAt: 'DESC', status: 'ASC' },
      },
    });

    console.log(passSlips);

    const passSlipDetails = await Promise.all(
      passSlips.map(async (passSlip) => {
        //console.log('passSlip: ', passSlip);
        const names = await this.getSupervisorAndEmployeeNames(passSlip.passSlipId.employeeId, passSlip.supervisorId);
        console.log('names: ', names);
        const assignment = await this.getEmployeeAssignment(passSlip.passSlipId.employeeId);
        //console.log('assignment: ', assignment);
        const avatarUrl = (await this.employeeService.getEmployeeDetails(passSlip.passSlipId.employeeId)).photoUrl;
        const { passSlipId, ...restOfPassSlip } = passSlip;
        const { dateOfApplication, ...restOfPassSlipId } = passSlipId;
        return {
          ...restOfPassSlip,
          dateOfApplication: dayjs(dateOfApplication).format('YYYY-MM-DD'),
          ...restOfPassSlipId,
          ...names,
          avatarUrl,
          assignmentName: assignment.assignment.name,
        };
      })
    );

    console.log(passSlipDetails);
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
      assignment: this.abbreviate(employeeAssignment.assignment.name),
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

  //ilipat sa utils;
  private abbreviate(word: string) {
    const words = word.split(' ');
    let abbreviation = '';

    const capitalPattern = new RegExp('[A-Z]');

    words.map((_word) => {
      if (capitalPattern.test(_word[0])) abbreviation += _word[0];
    });
    return abbreviation;
  }

  async updatePassSlipTimeRecord(updatePassSlipTimeRecordDto: UpdatePassSlipTimeRecordDto) {
    const { id, action } = updatePassSlipTimeRecordDto;
    const timeNow = dayjs().format('HH:mm');
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
      updateResult = await this.crud().update({
        dto: { id, timeOut },
        updateBy: { id },
        onError: () => new InternalServerErrorException(),
      });
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
    if (result.affected > 0) return hrUpdatePassSlipTimeRecordDto;
  }

  @Cron('0 57 23 * * 0-6')
  async updatePassSlipStatusCron() {
    //1. fetch approved pass slips from yesterday (Personal Business Only)
    const passSlips = (await this.rawQuery(`
        SELECT 
            ps.pass_slip_id id, 
            employee_id_fk employeeId, 
            date_of_application dateOfApplication, 
            nature_of_business natureOfBusiness,
            time_in timeIn,
            time_out timeOut,
            encoded_time_in encodedTimeIn,
            encoded_time_out encodedTimeOut,
            ps.ob_transportation obTransportation,
            ps.estimate_hours estimateHours,
            ps.purpose_destination purposeDestination,
            ps.is_cancelled isCancelled,
            ps.dispute_remarks disputeRemarks,
            psa.status status,
            ps.created_at createdAt,
            ps.updated_at updatedAt,
            ps.deleted_at deletedAt,
            ps.is_dispute_approved disputeApproved
          FROM pass_slip ps 
          INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id 
        WHERE DATE_FORMAT(date_of_application,'%Y-%m-%d') = DATE_FORMAT(now(),'%Y-%m-%d') 
        AND (psa.status = 'approved' OR psa.status = 'for supervisor approval' OR psa.status='for hrmo approval'); 
    `)) as PassSlipForLedger[];

    //2. check time in and time out
    console.log(passSlips);
    const passSlipsToLedger = await Promise.all(
      passSlips.map(async (passSlip) => {
        console.log(passSlip);
        const { id, timeIn, timeOut, natureOfBusiness, employeeId, dateOfApplication, status } = passSlip;

        if (timeIn === null && timeOut === null && status === PassSlipApprovalStatus.APPROVED) {
          await this.passSlipApprovalService.crud().update({ dto: { status: PassSlipApprovalStatus.UNUSED }, updateBy: { passSlipId: { id } } });
        } else if (
          timeIn === null &&
          timeOut === null &&
          (status === PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL || status === PassSlipApprovalStatus.FOR_HRMO_APPROVAL)
        ) {
          await this.passSlipApprovalService.crud().update({ dto: { status: PassSlipApprovalStatus.CANCELLED }, updateBy: { passSlipId: { id } } });
        }
        //2.1 if time in is null and time out is null update status to unused;

        //2.2  if time in is not null and time out is null check if not undertime
        if (timeOut !== null && timeIn === null) {
          if (natureOfBusiness === 'Undertime' || natureOfBusiness === 'Half Day' || natureOfBusiness === 'Personal Business') {
            //2.2.1 set time out to scheduled time out;
            //get employee current schedule schedule from dtr
            const employeeAssignment = await this.getEmployeeAssignment(employeeId);
            const { scheduleTimeOut } = (
              await this.rawQuery(
                `
                SELECT s.time_out scheduleTimeOut 
                FROM daily_time_record dtr INNER JOIN schedule s ON dtr.schedule_id_fk = s.schedule_id 
                WHERE dtr_date = ? AND dtr.company_id_fk= ?;`,
                [dateOfApplication, employeeAssignment.companyId]
              )
            )[0];
            await this.crud().update({ dto: { timeIn: scheduleTimeOut }, updateBy: { id } });
          }
        }
      })
    );
    console.log('-------------- PASS SLIP CRON JOB DONE --------------------');
  }

  @Cron('0 57 23 * * 0-6')
  async addPassSlipsToLedger() {
    //1. fetch approved pass slips from yesterday (Personal Business Only)
    const passSlips = (await this.rawQuery(`
        SELECT 
            ps.pass_slip_id id, 
            employee_id_fk employeeId, 
            date_of_application dateOfApplication, 
            nature_of_business natureOfBusiness,
            time_in timeIn,
            time_out timeOut,
            ps.is_medical isMedical,
            encoded_time_in encodedTimeIn,
            encoded_time_out encodedTimeOut,
            ps.ob_transportation obTransportation,
            ps.estimate_hours estimateHours,
            ps.purpose_destination purposeDestination,
            ps.is_cancelled isCancelled,
            ps.dispute_remarks disputeRemarks,
            ps.created_at createdAt,
            psa.status status,
            ps.updated_at updatedAt,
            ps.deleted_at deletedAt,
            ps.is_dispute_approved disputeApproved
          FROM pass_slip ps 
          INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id 
        WHERE get_date_after_num_of_working_days(date_of_application, 2) = DATE_FORMAT(now(),'%Y-%m-%d') AND psa.status = 'approved' 
        AND (ps.nature_of_business='Personal Business' OR ps.nature_of_business='Half Day' OR ps.nature_of_business = 'Undertime');
    `)) as PassSlipForLedger[];
    //2. check time in and time out
    console.log('pass slip here', passSlips);
    const passSlipsToLedger = await Promise.all(
      passSlips.map(async (passSlip) => {
        const {
          id,
          timeIn,
          timeOut,
          natureOfBusiness,
          employeeId,
          dateOfApplication,
          estimateHours,
          isCancelled,
          obTransportation,
          encodedTimeIn,
          encodedTimeOut,
          isMedical,
          purposeDestination,
          disputeRemarks,
          isDisputeApproved,
          createdAt,
          updatedAt,
          deletedAt,
        } = passSlip;
        const { passSlipCount } = (
          await this.rawQuery(`SELECT count(*) passSlipCount FROM employee_monitoring.leave_card_ledger_debit WHERE pass_slip_id_fk = ?;`, [id])
        )[0];

        if (passSlipCount === '0') {
          if (timeIn === null && timeOut === null && status === PassSlipApprovalStatus.APPROVED) {
            await this.passSlipApprovalService.crud().update({ dto: { status: PassSlipApprovalStatus.UNUSED }, updateBy: { passSlipId: { id } } });
          } else if (timeIn === null && timeOut === null && status === PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL) {
            await this.passSlipApprovalService.crud().update({ dto: { status: PassSlipApprovalStatus.CANCELLED }, updateBy: { passSlipId: { id } } });
          }
          //2.1 if time in is null and time out is null update status to unused;

          //2.2  if time in is not null and time out is null check if not undertime
          if (timeOut !== null && timeIn === null) {
            if (natureOfBusiness === 'Undertime' || natureOfBusiness === 'Half Day' || natureOfBusiness === 'Personal Business') {
              //2.2.1 set time out to scheduled time out;
              //get employee current schedule schedule from dtr
              const employeeAssignment = await this.getEmployeeAssignment(employeeId);
              const { scheduleTimeOut } = (
                await this.rawQuery(
                  `
                SELECT s.time_out scheduleTimeOut 
                FROM daily_time_record dtr INNER JOIN schedule s ON dtr.schedule_id_fk = s.schedule_id 
                WHERE dtr_date = ? AND dtr.company_id_fk= ?;`,
                  [dateOfApplication, employeeAssignment.companyId]
                )
              )[0];
              await this.crud().update({ dto: { timeIn: scheduleTimeOut }, updateBy: { id } });
            }
          }
          //2.2. INSERT TO LEDGER
          const { debitValue } = (await this.rawQuery(`SELECT get_debit_value(?) debitValue;`, [passSlip.id]))[0];

          await this.leaveCardLedgerDebitService.addLeaveCardLedgerDebit({
            passSlipId: {
              id: passSlip.id,
              employeeId,
              dateOfApplication: passSlip.dateOfApplication,
              natureOfBusiness: passSlip.natureOfBusiness,
              estimateHours,
              isMedical,
              isCancelled,
              obTransportation,
              purposeDestination,
              timeIn,
              timeOut,
              encodedTimeIn,
              encodedTimeOut,
              disputeRemarks,
              isDisputeApproved,
              createdAt,
              updatedAt,
              deletedAt,
            },
            debitValue,
          });
        }
      })
    );
    console.log('-------------- PASS SLIP CRON JOB DONE --------------------');
  }
  //notes: CREATE MODULE FOR employee sungkit from microservice,
  //create functions under utils;

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
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getAssignableSupervisorForPassSlip(employeeData: { orgId: string; employeeId: string }) {
    const officerOfTheDayId = await this.officerOfTheDayService.getOfficerOfTheDayOrgByOrgId(employeeData.orgId);
    let officerOfTheDayName: string;
    if (officerOfTheDayId) officerOfTheDayName = (await this.employeeService.getEmployeeDetails(officerOfTheDayId)).employeeFullName;
    const employeeSupervisorId = await this.employeeService.getEmployeeSupervisorId(employeeData.employeeId);
    const employeeSupervisorName = (await this.employeeService.getEmployeeDetails(employeeSupervisorId)).employeeFullName;
    const supervisorAndOfficerOfTheDayArray =
      officerOfTheDayId !== null
        ? [
            { label: officerOfTheDayName, value: officerOfTheDayName },
            { label: employeeSupervisorName, value: employeeSupervisorId },
          ]
        : [{ label: employeeSupervisorName, value: employeeSupervisorId }];
    const supervisoryEmployees = await this.employeeService.getSupervisoryEmployeesForDropdown(employeeData.employeeId);
    const result = [...supervisorAndOfficerOfTheDayArray, ...supervisoryEmployees];
    return result.filter((value, index, self) => index === self.findIndex((item) => item.label === value.label && item.value === value.value));
  }
}
