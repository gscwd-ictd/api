import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getPassSlips(employeeId: string) {
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

    const passSlipsOngoing = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        where: { passSlipId: { employeeId }, status: PassSlipApprovalStatus.ONGOING },
        order: { createdAt: 'DESC' },
      },
    });

    const ongoing = await Promise.all(
      passSlipsOngoing.map(async (passSlip) => {
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
      WHERE ps.employee_id_fk = ? AND status = 'approved' OR status = 'disapproved' ORDER BY status ASC, ps.date_of_application DESC  
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

    const passSlips = { ongoing, completed: approvedDisapproved };
    console.log(passSlips);
    return passSlips;
  }

  async getAllPassSlips() {
    const passSlips = <PassSlipApproval[]>await this.passSlipApprovalService.crud().findAll({
      find: {
        relations: { passSlipId: true },
        select: { supervisorId: true, status: true },
        where: { status: PassSlipApprovalStatus.ONGOING },
        order: { createdAt: 'DESC', status: 'ASC' },
      },
    });
    console.log(passSlips);
    return passSlips;
  }
}
