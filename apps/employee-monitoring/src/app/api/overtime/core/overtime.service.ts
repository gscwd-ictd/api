import {
  CreateOvertimeDto,
  OvertimeAccomplishment,
  OvertimeApplication,
  OvertimeImmediateSupervisor,
  UpdateOvertimeAccomplishmentDto,
} from '@gscwd-api/models';
import { OvertimeStatus, ScheduleBase } from '@gscwd-api/utils';
import { Injectable } from '@nestjs/common';
import dayjs = require('dayjs');
import { DataSource, EntityManager } from 'typeorm';
import { EmployeeScheduleService } from '../../daily-time-record/components/employee-schedule/core/employee-schedule.service';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
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
    private readonly overtimeImmediateSupervisorService: OvertimeImmediateSupervisorService,
    private readonly overtimeApprovalService: OvertimeApprovalService,
    private readonly employeeService: EmployeesService,
    private readonly employeeScheduleService: EmployeeScheduleService,
    private readonly dailyTimeRecordService: DailyTimeRecordService,
    private readonly dataSource: DataSource
  ) {}

  async createOvertime(createOverTimeDto: CreateOvertimeDto) {
    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const { employees, ...overtimeApplication } = createOverTimeDto;

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

  async getOvertimeApplicationsForApproval(managerId: string) {
    //
    //1. get manager organization id
    const managerOrgId = (await this.employeeService.getEmployeeDetails(managerId)).assignment.id;
    //2. get employeeIds from organization id
    const employeesUnderOrgId = await this.employeeService.getEmployeesByOrgId(managerOrgId);

    const employeeIds = await Promise.all(
      employeesUnderOrgId.map(async (employee) => {
        return employee.value;
      })
    );
    //console.log(employeeIds);
    //3. get overtime employee ids for approval
    const pendingOvertimeApplications = await this.overtimeApplicationService.getOvertimeApplicationsByEmployeeIdsByStatus(
      employeeIds,
      OvertimeStatus.PENDING
    );

    console.log('testing testing testing ', pendingOvertimeApplications);

    const approvedOvertimeApplications = await this.overtimeApplicationService.getOvertimeApplicationsByEmployeeIdsByStatus(
      employeeIds,
      OvertimeStatus.APPROVED
    );

    const disapprovedOvertimeApplications = await this.overtimeApplicationService.getOvertimeApplicationsByEmployeeIdsByStatus(
      employeeIds,
      OvertimeStatus.DISAPPROVED
    );

    const approvedOvertimeApplicationsWithSupervisorName = await Promise.all(
      approvedOvertimeApplications.map(async (overtimeApplication) => {
        const { employeeId, overtimeApplicationId, ...rest } = overtimeApplication;
        const immediateSupervisorName = (await this.employeeService.getEmployeeDetails(employeeId)).employeeFullName;
        const employees = (await this.overtimeEmployeeService
          .crud()
          .findAll({ find: { select: { employeeId: true }, where: { overtimeApplicationId: { id: overtimeApplicationId } } } })) as {
          employeeId: string;
        }[];

        const employeesWithDetails = await Promise.all(
          employees.map(async (employee) => {
            const { employeeId } = employee;
            const employeeDetail = await this.employeeService.getEmployeeDetails(employeeId);
            const { assignment, employeeFullName, companyId, photoUrl } = employeeDetail;
            return {
              employeeId,
              companyId,
              fullName: employeeFullName,
              positionTitle: assignment.positionTitle,
              avatarUrl: photoUrl,
              assignment: assignment.name,
            };
          })
        );
        return { id: overtimeApplicationId, ...rest, immediateSupervisorName, employees: employeesWithDetails };
      })
    );

    const pendingOvertimeApplicationsWithSupervisorName = await Promise.all(
      pendingOvertimeApplications.map(async (overtimeApplication) => {
        const { employeeId, overtimeApplicationId, ...rest } = overtimeApplication;
        const immediateSupervisorName = (await this.employeeService.getEmployeeDetails(employeeId)).employeeFullName;
        const employees = (await this.overtimeEmployeeService
          .crud()
          .findAll({ find: { select: { employeeId: true }, where: { overtimeApplicationId: { id: overtimeApplicationId } } } })) as {
          employeeId: string;
        }[];

        const employeesWithDetails = await Promise.all(
          employees.map(async (employee) => {
            const { employeeId } = employee;
            const employeeDetail = await this.employeeService.getEmployeeDetails(employeeId);
            const { assignment, employeeFullName, companyId, photoUrl } = employeeDetail;
            return {
              employeeId,
              companyId,
              fullName: employeeFullName,
              positionTitle: assignment.positionTitle,
              avatarUrl: photoUrl,
              assignment: assignment.name,
            };
          })
        );
        return { id: overtimeApplicationId, ...rest, immediateSupervisorName, employees: employeesWithDetails };
      })
    );

    const disapprovedOvertimeApplicationsWithSupervisorName = await Promise.all(
      disapprovedOvertimeApplications.map(async (overtimeApplication) => {
        const { employeeId, overtimeApplicationId, ...rest } = overtimeApplication;
        const immediateSupervisorName = (await this.employeeService.getEmployeeDetails(employeeId)).employeeFullName;
        const employees = (await this.overtimeEmployeeService
          .crud()
          .findAll({ find: { select: { employeeId: true }, where: { overtimeApplicationId: { id: overtimeApplicationId } } } })) as {
          employeeId: string;
        }[];

        const employeesWithDetails = await Promise.all(
          employees.map(async (employee) => {
            const { employeeId } = employee;
            const employeeDetail = await this.employeeService.getEmployeeDetails(employeeId);
            const { assignment, employeeFullName, companyId, photoUrl } = employeeDetail;
            return {
              employeeId,
              companyId,
              fullName: employeeFullName,
              positionTitle: assignment.positionTitle,
              avatarUrl: photoUrl,
              assignment: assignment.name,
            };
          })
        );
        return { id: overtimeApplicationId, ...rest, immediateSupervisorName, employees: employeesWithDetails };
      })
    );
    return {
      forApproval: pendingOvertimeApplicationsWithSupervisorName,
      completed: { approved: approvedOvertimeApplicationsWithSupervisorName, disapproved: disapprovedOvertimeApplicationsWithSupervisorName },
    };
  }

  async getOvertimeApplicationsBySupervisorIdAndStatus(id: string, status: OvertimeStatus) {
    return (await this.overtimeApplicationService.crud().findAll({
      find: {
        select: {
          id: true,
          plannedDate: true,
          estimatedHours: true,
          purpose: true,
          status: true,
          overtimeImmediateSupervisorId: { employeeId: true },
        },
        where: { overtimeImmediateSupervisorId: { id }, status },
        relations: { overtimeImmediateSupervisorId: true },
        order: { createdAt: 'ASC' },
      },
    })) as OvertimeApplication[];
  }

  async getOvertimeEmployeeDetails(overtimeApplications: OvertimeApplication[]) {
    return await Promise.all(
      overtimeApplications.map(async (overtime) => {
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

  async getOvertimeApplicationsByImmediateSupervisorId(id: string) {
    const approvedOvertimes = await this.getOvertimeApplicationsBySupervisorIdAndStatus(id, OvertimeStatus.APPROVED);
    const forApprovalOvertimes = await this.getOvertimeApplicationsBySupervisorIdAndStatus(id, OvertimeStatus.PENDING);

    const approvedOvertimesWithEmployees = await this.getOvertimeEmployeeDetails(approvedOvertimes);
    const forApprovalOvertimesWithEmployees = await this.getOvertimeEmployeeDetails(forApprovalOvertimes);

    return {
      completed: approvedOvertimesWithEmployees,
      forApproval: forApprovalOvertimesWithEmployees,
    };
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

  async getImmediateSupervisorList() {
    const supervisors = (await this.overtimeImmediateSupervisorService
      .crud()
      .findAll({ find: { select: { id: true, employeeId: true } } })) as OvertimeImmediateSupervisor[];

    const employeeList = await Promise.all(
      supervisors.map(async (supervisor) => {
        const { employeeId, id } = supervisor;
        const employeeDetails = await this.employeeService.getEmployeeDetails(employeeId);
        console.log(employeeDetails);
        const { assignment, employeeFullName, photoUrl, positionTitle, name } = employeeDetails;
        return {
          id,
          immediateSupervisorName: employeeFullName,
          positionTitle: assignment.positionTitle,
          assignment: assignment.name,
          avatarUrl: photoUrl,
        };
      })
    );
    return employeeList;
  }

  async getOvertimeDetails(employeeId: string, overtimeApplicationId: string) {
    const employeeSchedules = await this.employeeScheduleService.getAllEmployeeSchedules(employeeId);
    const scheduleBase = employeeSchedules !== null ? employeeSchedules[0].scheduleBase : null;
    const employeeDetails = await this.employeeService.getEmployeeDetails(employeeId);

    const overtimeDetails = (await this.overtimeAccomplishmentService.crud().findOne({
      find: {
        where: { overtimeEmployeeId: { employeeId, overtimeApplicationId: { id: overtimeApplicationId } } },
        relations: { overtimeEmployeeId: { overtimeApplicationId: true } },
      },
    })) as OvertimeAccomplishment;

    const { createdAt, updatedAt, deletedAt, ...rest } = overtimeDetails;

    let hasDtr = null;

    if (scheduleBase === ScheduleBase.OFFICE) {
      hasDtr = await this.dailyTimeRecordService.getHasIvms({
        companyId: employeeDetails.companyId.replace('-', ''),
        entryDate: dayjs(rest.overtimeEmployeeId.overtimeApplicationId.plannedDate).toDate(),
      });
    }

    return { rest, hasDtr };
  }

  async updateOvertimeAccomplishment(updateOvertimeAccomplishmentDto: UpdateOvertimeAccomplishmentDto) {
    const { employeeId, overtimeApplicationId, ...overtimeAccomplishmentDto } = updateOvertimeAccomplishmentDto;

    const result = await this.overtimeAccomplishmentService.crud().update({
      dto: overtimeAccomplishmentDto,
      updateBy: {
        overtimeEmployeeId: { employeeId, overtimeApplicationId: { id: overtimeApplicationId.id } },
      },
    });
  }

  async getEmployeeListBySupervisorId(employeeId: string) {
    const employeeSupervisor = await this.overtimeImmediateSupervisorService
      .crud()
      .findOne({ find: { select: { orgId: true }, where: { employeeId } } });
    if (employeeSupervisor) {
      return await this.employeeService.getEmployeesByOrgId(employeeSupervisor.orgId);
    }
  }

  async getOvertimeImmediateSupervisorByEmployeeId(employeeId: string) {
    try {
      const overtimeImmediateSupervisorByEmployeeId = (
        await this.overtimeImmediateSupervisorService.crud().findOneOrNull({ find: { select: { id: true }, where: { employeeId } } })
      ).id;

      return overtimeImmediateSupervisorByEmployeeId;
    } catch (error) {
      return null;
    }
  }
}
