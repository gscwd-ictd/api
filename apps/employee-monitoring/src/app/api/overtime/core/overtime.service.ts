import { CreateOvertimeDto, OvertimeAccomplishment, OvertimeApplication } from '@gscwd-api/models';
import { OvertimeStatus } from '@gscwd-api/utils';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { EmployeeScheduleService } from '../../daily-time-record/components/employee-schedule/core/employee-schedule.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { OvertimeAccomplishmentService } from '../components/overtime-accomplishment/core/overtime-accomplishment.service';
import { OvertimeApplicationService } from '../components/overtime-application/core/overtime-application.service';
import { OvertimeApprovalService } from '../components/overtime-approval/core/overtime-approval.service';
import { OvertimeEmployeeService } from '../components/overtime-employee/core/overtime-employee.service';
import { OvertimeImmediateSupervisorService } from '../components/overtime-immediate-supervisor/core/overtime-immediate-supervisor.service';

@Injectable()
export class OvertimeService {
  constructor(
    private readonly overtimeAccomplishmentService: OvertimeAccomplishmentService,
    private readonly overtimeEmployeeService: OvertimeEmployeeService,
    private readonly overtimeApplicationService: OvertimeApplicationService,
    private readonly overtimeImmediateService: OvertimeImmediateSupervisorService,
    private readonly overtimeApprovalService: OvertimeApprovalService,
    private readonly employeeService: EmployeesService,
    private readonly employeeScheduleService: EmployeeScheduleService,
    private readonly dataSource: DataSource
  ) {}

  async createOvertime(createOverTimeDto: CreateOvertimeDto) {
    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const { overtimeApplication, employees } = createOverTimeDto;

      //1. insert to overtime application
      const application = await this.overtimeApplicationService.createOvertimeApplication(overtimeApplication, entityManager);
      //2. insert to overtime approval (default status)
      const approval = await this.overtimeApprovalService.createOvertimeApproval(
        {
          overtimeApplicationId: application,
        },
        entityManager
      );
      //3. insert to overtime employees
      const overtimeEmployees = await Promise.all(
        employees.map(async (employee) => {
          const overtimeEmployeeId = await this.overtimeEmployeeService.createOvertimeEmployees(
            {
              overtimeApplicationId: application,
              employeeId: employee,
            },
            entityManager
          );
          //4. insert to overtime accomplishment (default status)
          const accomplishment = await this.overtimeAccomplishmentService.createOvertimeAccomplishment(
            {
              overtimeEmployeeId,
              status: OvertimeStatus.PENDING,
            },
            entityManager
          );

          return { overtimeEmployeeId, accomplishment };
        })
      );
      return { application, approval, employees: overtimeEmployees };
    });
    return result;
  }

  async getOvertimeApplications() {
    const overtimes = (await this.overtimeApplicationService.crud().findAll({
      find: {
        select: {
          id: true,
          plannedDate: true,
          estimatedHours: true,
          purpose: true,
          status: true,
          overtimeImmediateSupervisorId: { employeeId: true },
        },
        relations: { overtimeImmediateSupervisorId: true },
      },
    })) as OvertimeApplication[];
    return await Promise.all(
      overtimes.map(async (overtime) => {
        const { overtimeImmediateSupervisorId, ...rest } = overtime;
        const employees = (await this.overtimeEmployeeService.crud().findAll({
          find: {
            select: { employeeId: true },
            where: { overtimeApplicationId: { id: overtime.id } },
          },
        })) as { employeeId: string }[];

        const immediateSupervisorName = await this.employeeService.getEmployeeName(overtimeImmediateSupervisorId.employeeId);

        const employeesDetails = (await Promise.all(
          employees.map(async (employee) => {
            const { employeeId } = employee;

            const employeeDetails = await this.employeeService.getEmployeeDetails(employeeId);
            const employeeSchedules = await this.employeeScheduleService.getAllEmployeeSchedules(employeeId);
            const scheduleBase = employeeSchedules !== null ? employeeSchedules[0].scheduleBase : null;
            const { companyId, employeeFullName, positionTitle, assignment, photoUrl } = employeeDetails;
            return {
              employeeId,
              companyId,
              fullName: employeeFullName,
              positionTitle,
              scheduleBase,
              avatarUrl: photoUrl,
              assignment: assignment.name,
            };
          })
        )) as [];

        return { ...rest, immediateSupervisorName, employees: employeesDetails };
      })
    );
  }

  async getOvertimeDetails(employeeId: string, overtimeApplicationId: string) {
    const overtimeDetails = (await this.overtimeAccomplishmentService.crud().findOne({
      find: { where: { overtimeEmployeeId: { employeeId, overtimeApplicationId: { id: overtimeApplicationId } } } },
    })) as OvertimeAccomplishment;

    const { createdAt, updatedAt, deletedAt, ...rest } = overtimeDetails;

    return rest;
  }
}
