import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeSchedule, PassSlip, PassSlipApproval, PassSlipDto } from '@gscwd-api/models';
import { PassSlipApprovalService } from '../components/approval/core/pass-slip-approval.service';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { PassSlipApprovalStatus } from '@gscwd-api/utils';
import { DataSource } from 'typeorm';

@Injectable()
export class PassSlipService extends CrudHelper<PassSlip> {
  constructor(
    private readonly crudService: CrudService<PassSlip>,
    private readonly passSlipApprovalService: PassSlipApprovalService,
    private readonly client: MicroserviceClient,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  async addPassSlip(passSlipDto: PassSlipDto) {
    //
    //const repo = this.getDatasource();
    const passSlip = await this.dataSource.transaction(async (transactionEntityManager) => {
      const { approval, ...rest } = passSlipDto;
      const supervisorId = await this.client.call<string, string, string>({
        action: 'send',
        payload: rest.employeeId,
        pattern: 'get_employee_supervisor_id',
        onError: (error) => new NotFoundException(error),
      });
      //this.crudService.transact<PassSlip>(transactionEntityManager).create();
      const passSlipResult = await transactionEntityManager.getRepository(PassSlip).save(rest);
      const approvalResult = await transactionEntityManager
        .getRepository(PassSlipApproval)
        .save({ passSlipId: passSlipResult, supervisorId, ...approval });
      return { passSlipResult, approvalResult };
    });
    return passSlip;
  }

  async getPassSlipsBySupervisorId(supervisorId: string) {
    const passSlipsForApproval = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        where: { supervisorId, status: PassSlipApprovalStatus.FOR_APPROVAL },
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
    return { forApproval, completed: { approved, disapproved } };
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
        where: { passSlipId: { employeeId }, status: PassSlipApprovalStatus.FOR_APPROVAL },
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

    const passSlipsApprovedDisapproved = <PassSlipApproval[]>await this.rawQuery(
      `
      SELECT 
        psa.created_at createdAt,
        psa.updated_at updatedAt,
        psa.deleted_at deletedAt,
        ps.pass_slip_id id,
        ps.employee_id_fk employeeId,
        psa.supervisor_id_fk supervisorId, 
        psa.status status,
        DATE_FORMAT(ps.date_of_application,'%Y-%m-%d') dateOfApplication,
        nature_of_business natureOfBusiness, 
        ob_transportation obTransportation, 
        estimate_hours estimateHours,
        purpose_destination purposeDestination,
        is_cancelled isCancelled
      FROM pass_slip_approval psa 
        INNER JOIN pass_slip ps ON ps.pass_slip_id = psa.pass_slip_id_fk 
      WHERE ps.employee_id_fk = ? AND (status = 'approved' OR status = 'disapproved') ORDER BY status ASC, ps.date_of_application DESC  
    `,
      [employeeId]
    );

    const approvedDisapproved = await Promise.all(
      passSlipsApprovedDisapproved.map(async (passSlip) => {
        const { passSlipId, ...restOfPassSlip } = passSlip;

        const names = await this.client.call<string, { employeeId: string; supervisorId: string }, object>({
          action: 'send',
          payload: { employeeId, supervisorId: passSlip.supervisorId },
          pattern: 'get_employee_supervisor_names',
          onError: (error) => new NotFoundException(error),
        });
        return { ...passSlipId, ...names, ...restOfPassSlip };
      })
    );

    const passSlips = { forApproval, completed: approvedDisapproved };
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
      supervisorSignature;
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
  //notes: CREATE MODULE FOR employee sungkit from microservice,
  //create functions under utils;
}
