import { CrudHelper, CrudService } from '@gscwd-api/crud';
import {
  CreateOvertimeEmployeeDto,
  DeleteOvertimeEmployeeByImmediateSupervisorDto,
  DeleteOvertimeEmployeeByManagerDto,
  OvertimeEmployee,
} from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EmployeesService } from '../../../../employees/core/employees.service';
import { OvertimeApplicationService } from '../../overtime-application/core/overtime-application.service';
import { RpcException } from '@nestjs/microservices';
import { OvertimeAccomplishmentService } from '../../overtime-accomplishment/core/overtime-accomplishment.service';
import { OvertimeApprovalService } from '../../overtime-approval/core/overtime-approval.service';
import { OvertimeStatus } from '@gscwd-api/utils';

@Injectable()
export class OvertimeEmployeeService extends CrudHelper<OvertimeEmployee> {
  constructor(
    private readonly crudService: CrudService<OvertimeEmployee>,
    private readonly employeeService: EmployeesService,
    private readonly overtimeApplicationService: OvertimeApplicationService,
    private readonly overtimeAccomplishmentService: OvertimeAccomplishmentService,
    private readonly overtimeApprovalService: OvertimeApprovalService
  ) {
    super(crudService);
  }

  async createOvertimeEmployees(createOvertimeEmployeeDto: CreateOvertimeEmployeeDto, entityManager: EntityManager) {
    //get salary grade if casual/permanent...get daily rate if job order
    const { dailyRate, salaryGradeAmount } = await this.employeeService.getSalaryGradeOrDailyRateByEmployeeId(createOvertimeEmployeeDto.employeeId);

    return await this.crudService.transact<OvertimeEmployee>(entityManager).create({
      dto: { salaryGradeAmount, dailyRate, ...createOvertimeEmployeeDto },
      onError: () => new InternalServerErrorException(),
    });
  }

  async deleteOvertimeEmployeeByManager(deleteOvertimeEmployeeByManagerDto: DeleteOvertimeEmployeeByManagerDto) {
    try {
      const { overtimeApplicationId, employeeId, managerId } = deleteOvertimeEmployeeByManagerDto;

      const overtimeApproval = await this.overtimeApprovalService
        .crud()
        .findOneOrNull({ find: { where: { managerId, overtimeApplicationId: { id: overtimeApplicationId.toString() } } } });

      if (!overtimeApproval) {
        throw new RpcException({
          message: 'Overtime does not exists or user is not the manager of the Overtime Applicant',
        });
      }

      const overtimeEmployee = await this.crud().findOneOrNull({
        find: { where: { overtimeApplicationId: { id: overtimeApplicationId.toString() }, employeeId } },
      });
      if (!overtimeEmployee) {
        throw new RpcException({
          message: 'Employee is not found or maybe already deleted.',
        });
      }
      await this.overtimeAccomplishmentService.crud().update({ dto: { status: OvertimeStatus.REMOVED }, updateBy: { overtimeEmployeeId: overtimeEmployee } })
      return overtimeEmployee;
    } catch (error) {
      console.log(error);
      if (error instanceof RpcException) {
        let code = 500;
        if (error.message === 'Employee is not found or maybe already deleted.') code = 404;
        if (error.message === 'Overtime does not exists or user is not the manager of the Overtime Applicant') code = 403;
        throw new RpcException({
          message: error.message,
          code,
          details: 'Overtime Deletion Error',
        });
      }
    }
  }

  async deleteOvertimeEmployeeByImmediateSupervisorDto(
    deleteOvertimeEmployeeByImmediateSupervisorDto: DeleteOvertimeEmployeeByImmediateSupervisorDto
  ) {
    try {
      const { overtimeApplicationId, employeeId, immediateSupervisorEmployeeId } = deleteOvertimeEmployeeByImmediateSupervisorDto;

      const overtimeApplication = await this.overtimeApplicationService.crud().findOneOrNull({
        find: { where: { id: overtimeApplicationId.toString() } },
      });

      const overtimeImmediateSupervisor = await this.overtimeApplicationService.crud().findOneOrNull({
        find: { where: { id: overtimeApplicationId.toString(), overtimeImmediateSupervisorId: { employeeId: immediateSupervisorEmployeeId } } },
      });

      if (!overtimeImmediateSupervisor)
        throw new RpcException({
          message: 'User is not the Immediate Supervisor of the Overtime Application',
        });

      const overtimeEmployee = await this.crud().findOneOrNull({
        find: { where: { overtimeApplicationId: { id: overtimeApplicationId.toString() }, employeeId } },
      });
      if (!overtimeEmployee) {
        throw new RpcException({
          message: 'Employee is not found or maybe already deleted.',
        });
      }

      const overtimeAccomplishment = await this.overtimeAccomplishmentService.crud().findOneOrNull({
        find: {
          where: {
            overtimeEmployeeId: { id: overtimeEmployee.id },
          },
        },
      });

      if (overtimeAccomplishment.status === 'approved' && overtimeApplication.status === 'approved') {
        throw new RpcException({
          message: 'Overtime Accomplishment is already approved. Deleting is not allowed.',
        });
      }

      await this.overtimeAccomplishmentService.crud().delete({ deleteBy: { overtimeEmployeeId: overtimeEmployee }, softDelete: false });
      await this.crud().delete({ deleteBy: { id: overtimeEmployee.id }, softDelete: false });

      console.log(overtimeEmployee);
      return overtimeEmployee;
    } catch (error) {
      console.log(error);
      if (error instanceof RpcException) {
        let code = 500;
        if (error.message === 'Employee is not found or maybe already deleted.') code = 404;
        if (
          error.message === 'Overtime Accomplishment is already approved. Deleting is not allowed.' ||
          error.message === 'User is not the Immediate Supervisor of the Overtime Application'
        )
          code = 403;
        throw new RpcException({
          message: error.message,
          code,
          details: 'Overtime Deletion Error',
        });
      }
    }
  }
}
