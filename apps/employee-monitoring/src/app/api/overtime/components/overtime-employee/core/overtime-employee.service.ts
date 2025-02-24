import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOvertimeEmployeeDto, DeleteOvertimeEmployeeDto, OvertimeEmployee } from '@gscwd-api/models';
import { ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EmployeesService } from '../../../../employees/core/employees.service';
import { OvertimeApplicationService } from '../../overtime-application/core/overtime-application.service';
import { RpcException } from '@nestjs/microservices';
import { OvertimeAccomplishmentService } from '../../overtime-accomplishment/core/overtime-accomplishment.service';

@Injectable()
export class OvertimeEmployeeService extends CrudHelper<OvertimeEmployee> {
  constructor(
    private readonly crudService: CrudService<OvertimeEmployee>,
    private readonly employeeService: EmployeesService,
    private readonly overtimeApplicationService: OvertimeApplicationService,
    private readonly overtimeAccomplishmentService: OvertimeAccomplishmentService
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

  async deleteOvertimeEmployee(deleteOvertimeEmployeeDto: DeleteOvertimeEmployeeDto) {
    try {
      const { overtimeApplicationId, employeeId, immediateSupervisorEmployeeId } = deleteOvertimeEmployeeDto;

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

      console.log(overtimeAccomplishment);

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
