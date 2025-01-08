import {
  CreateOvertimeDto,
  OvertimeAccomplishment,
  OvertimeApplication,
  OvertimeEmployee,
  OvertimeImmediateSupervisor,
  UpdateAllOvertimeAccomplishmentDto,
  UpdateOvertimeAccomplishmentByEmployeeDto,
  UpdateOvertimeAccomplishmentDto,
  UpdateOvertimeApprovalDto,
} from '@gscwd-api/models';
import { OvertimeHrsRendered, OvertimeStatus, ReportHalf, ScheduleBase } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import dayjs = require('dayjs');
import { Between, DataSource, EntityManager, EntityMetadata, } from 'typeorm';
import { EmployeeScheduleService } from '../../daily-time-record/components/employee-schedule/core/employee-schedule.service';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { OvertimeAccomplishmentService } from '../components/overtime-accomplishment/core/overtime-accomplishment.service';
import { OvertimeApplicationService } from '../components/overtime-application/core/overtime-application.service';
import { OvertimeApprovalService } from '../components/overtime-approval/core/overtime-approval.service';
import { OvertimeEmployeeService } from '../components/overtime-employee/core/overtime-employee.service';
import { OvertimeImmediateSupervisorService } from '../components/overtime-immediate-supervisor/core/overtime-immediate-supervisor.service';
import { getDayRange1stHalf, getDayRange2ndHalf } from '@gscwd-api/utils';
import { WorkSuspensionService } from '../../work-suspension/core/work-suspension.service';

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
    private readonly dataSource: DataSource,
    private readonly workSuspensionService: WorkSuspensionService
  ) { }

  async createOvertime(createOverTimeDto: CreateOvertimeDto) {
    const result = await this.dataSource.transaction(async (entityManager: EntityManager) => {
      try {
        const { employees, ...overtimeApplication } = createOverTimeDto;
        let application;
        const { overtimeImmediateSupervisorId, employeeId, ...restOfOvertimeApplication } = overtimeApplication;
        const dmanagerId = await this.employeeService.getEmployeeSupervisorId(employeeId);
        if (overtimeImmediateSupervisorId !== null) {
          application = await this.overtimeApplicationService.createOvertimeApplication(
            { overtimeImmediateSupervisorId, ...restOfOvertimeApplication },
            entityManager
          );
        } else {
          //manager
          application = await this.overtimeApplicationService.createOvertimeApplication(
            { managerId: employeeId, ...restOfOvertimeApplication },
            entityManager
          );
          //2. insert to overtime approval (default status)
        }
        //1. insert to overtime application

        const approval = await this.overtimeApprovalService.createOvertimeApproval(
          {
            overtimeApplicationId: application,
            managerId: dmanagerId,
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
      } catch (error) {
        console.log(error);
      }
    });
    return result;
  }

  async getOvertimeApplicationDetailByManagerIdAndId(managerId: string, id: string) {
    //1. get manager organization id
    const managerOrgId = (await this.employeeService.getEmployeeDetails(managerId)).assignment.id;
    //2. get employeeIds from organization id
    const employeesUnderOrgId = await this.employeeService.getEmployeesByOrgId(managerOrgId);
    const employeeIds = await Promise.all(
      employeesUnderOrgId.map(async (employee) => {
        return employee.value;
      })
    );

    //3. get overtime employee ids for approval
    const overtimeApplication = await this.overtimeApplicationService.getOvertimeApplicationByEmployeeIdsAndOvertimeId(employeeIds, id);

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

        const overtime = (
          await this.employeeScheduleService.rawQuery(
            `
            SELECT 
             oa.overtime_accomplishment overtimeAccomplishmentId,
             IF(accomplishments IS NOT NULL,true,false) isAccomplishmentSubmitted,
             oa.approved_by approvedBy,
             DATE_FORMAT(oa.date_approved, '%Y-%m-%d %H:%i%:%s') dateApproved, 
             oa.status status 
              FROM overtime_accomplishment oa 
              INNER JOIN overtime_employee oe ON oe.overtime_employee_id = oa.overtime_employee_id_fk 
            WHERE oe.employee_id_fk = ? AND oe.overtime_application_id_fk = ?;`,
            [employeeId, overtimeApplication.overtimeApplicationId]
          )
        )[0];

        const { isAccomplishmentSubmitted, status, overtimeAccomplishmentId, approvedBy, dateApproved } = overtime;

        const _approvedBy =
          approvedBy === null || approvedBy === '' ? null : (await this.employeeService.getEmployeeDetails(approvedBy)).employeeFullName;

        return {
          employeeId,
          companyId,
          overtimeAccomplishmentId,
          fullName: employeeFullName,
          positionTitle: assignment.positionTitle,
          avatarUrl: photoUrl,
          assignment: assignment.name,
          isAccomplishmentSubmitted,
          accomplishmentStatus: status,
          approvedBy: _approvedBy,
        };
      })
    );
    return { id: overtimeApplicationId, ...rest, immediateSupervisorName, employees: employeesWithDetails };
  }

  async getOvertimeApplicationsForManagerApprovalCount(managerId: string) {
    //1. get manager organization id
    const managerOrgId = (await this.employeeService.getEmployeeDetails(managerId)).assignment.id;
    //2. get employeeIds from organization id
    const employees = await this.employeeService.getEmployeesByOrgId(managerOrgId);
    const employeeIds = employees.map((emp) => emp.value);

    const count = (
      await this.overtimeApplicationService.rawQuery(
        `SELECT COUNT(DISTINCT oa.overtime_application_id) countForApprovalOT FROM overtime_application oa 
          INNER JOIN overtime_employee oe ON oe.overtime_application_id_fk = oa.overtime_application_id 
         WHERE employee_id_fk IN (?) AND status = 'pending' AND oa.manager_id_fk <> ?;`,
        [employeeIds, managerId]
      )
    )[0].countForApprovalOT;
    return parseInt(count);
  }

  async getOvertimeApplicationsForApprovalV2(managerId: string) {
    //1. get manager organization id
    const managerOrgId = (await this.employeeService.getBasicEmployeeDetails(managerId)).assignment.id;
    //check if officer of the day/uncomment below if rules change again for officer of the day approval;
    const officerOfTheDayOrgs = [];

    //2. get employeeIds from organization id

    const employeesUnderOrgId = await this.employeeService.getEmployeesByOrgId(managerOrgId);

    const employeeIds = (
      await Promise.all(
        employeesUnderOrgId.map(async (employee) => {
          return employee.value;
        })
      )
    ).filter((val) => {
      return val !== managerId;
    });

    //3. get overtime employee ids for approval
    const overtimeApplications = await this.overtimeApplicationService.getOvertimeApplicationsByEmployeeIds(employeeIds, managerId);

    const overtimeApplicationsWithSupervisorName = await Promise.all(
      overtimeApplications.map(async (overtimeApplication) => {
        const { employeeId, overtimeApplicationId, ...rest } = overtimeApplication;
        const immediateSupervisorName = (await this.employeeService.getBasicEmployeeDetails(employeeId)).employeeFullName;

        const employees = (await this.overtimeEmployeeService.crud().findAll({
          find: {
            select: { employeeId: true },
            where: { overtimeApplicationId: { id: overtimeApplicationId } },
            order: { overtimeApplicationId: { plannedDate: 'DESC', status: 'DESC' } },
          },
        })) as {
          employeeId: string;
        }[];

        const employeesWithDetails = await Promise.all(
          employees.map(async (employee) => {
            const { employeeId } = employee;
            const employeeDetail = await this.employeeService.getBasicEmployeeDetails(employeeId);

            const { assignment, employeeFullName, companyId, photoUrl } = employeeDetail;

            const { isAccomplishmentSubmitted, status, overtimeAccomplishmentId } = (
              await this.employeeScheduleService.rawQuery(
                `
            SELECT oa.overtime_accomplishment overtimeAccomplishmentId,IF(accomplishments IS NOT NULL,true,false) isAccomplishmentSubmitted, oa.status status 
              FROM overtime_accomplishment oa 
              INNER JOIN overtime_employee oe ON oe.overtime_employee_id = oa.overtime_employee_id_fk 
            WHERE oe.employee_id_fk = ? AND oe.overtime_application_id_fk = ?;`,
                [employeeId, overtimeApplication.overtimeApplicationId]
              )
            )[0];

            return {
              employeeId,
              companyId,
              overtimeAccomplishmentId,
              fullName: employeeFullName,
              positionTitle: assignment.positionTitle,
              avatarUrl: photoUrl,
              assignment: assignment.name,
              isAccomplishmentSubmitted,
              accomplishmentStatus: status,
            };
          })
        );

        return { id: overtimeApplicationId, ...rest, immediateSupervisorName, employees: employeesWithDetails };
      })
    );

    return overtimeApplicationsWithSupervisorName;
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

    //3. get overtime employee ids for approval
    const pendingOvertimeApplications = await this.overtimeApplicationService.getOvertimeApplicationsByEmployeeIdsByStatus(
      employeeIds,
      OvertimeStatus.PENDING
    );

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

  async getOvertimeApplicationsByManagerIdAndStatus(id: string, status: OvertimeStatus) {
    const overtimeApplication = (await this.overtimeApplicationService.crud().findAll({
      find: {
        select: {
          id: true,
          plannedDate: true,
          estimatedHours: true,
          purpose: true,
          status: true,
          managerId: true,
        },
        where: { managerId: id, status },
        relations: {
        },
        order: { plannedDate: 'DESC' },
      },
    })) as OvertimeApplication[];

    const overtimeApplicationsWithApprovals = await Promise.all(
      overtimeApplication.map(async (otApplication) => {
        const { id } = otApplication;

        const { dateApproved, remarks, approvedBy } = (
          await this.overtimeApprovalService.rawQuery(
            `SELECT date_approved dateApproved, approved_by approvedBy, remarks FROM overtime_approval WHERE overtime_application_id_fk = ?`,
            [id]
          )
        )[0];

        const _approvedBy = approvedBy !== null ? (await this.employeeService.getEmployeeDetails(approvedBy)).employeeFullName : null;

        return { ...otApplication, dateApproved, approvedBy: _approvedBy, remarks };
      })
    );
    return overtimeApplicationsWithApprovals;
  }

  async getOvertimeApplicationsBySupervisorIdAndStatus(id: string, status: OvertimeStatus) {
    const overtimeApplication = (await this.overtimeApplicationService.crud().findAll({
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
        order: { plannedDate: 'DESC' },
      },
    })) as OvertimeApplication[];

    const overtimeApplicationsWithApprovals = await Promise.all(
      overtimeApplication.map(async (otApplication) => {
        const { id } = otApplication;

        const { dateApproved, remarks, approvedBy } = (
          await this.overtimeApprovalService.rawQuery(
            `SELECT date_approved dateApproved, approved_by approvedBy, remarks FROM overtime_approval WHERE overtime_application_id_fk = ?`,
            [id]
          )
        )[0];

        const _approvedBy = approvedBy !== null ? (await this.employeeService.getEmployeeDetails(approvedBy)).employeeFullName : null;

        return { ...otApplication, dateApproved, approvedBy: _approvedBy, remarks };
      })
    );

    return overtimeApplicationsWithApprovals;
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

        const immediateSupervisorName = await this.employeeService.getEmployeeName(
          typeof overtimeImmediateSupervisorId === 'undefined' ? rest.managerId : overtimeImmediateSupervisorId.employeeId
        );

        const employeesDetails = (await Promise.all(
          employees.map(async (employee) => {
            const { employeeId } = employee;

            const employeeDetails = await this.employeeService.getBasicEmployeeDetails(employeeId);
            const employeeSchedules = await this.employeeScheduleService.getAllEmployeeSchedules(employeeId);
            const scheduleBase = employeeSchedules !== null ? employeeSchedules[0].scheduleBase : null;

            const { isAccomplishmentSubmitted, status } = (
              await this.employeeScheduleService.rawQuery(
                `
            SELECT IF(accomplishments IS NOT NULL,true,false) isAccomplishmentSubmitted, oa.status status
              FROM overtime_accomplishment oa 
              INNER JOIN overtime_employee oe ON oe.overtime_employee_id = oa.overtime_employee_id_fk 
            WHERE oe.employee_id_fk = ? AND oe.overtime_application_id_fk = ?;`,
                [employeeId, overtime.id]
              )
            )[0];

            const { companyId, employeeFullName, positionTitle, assignment, photoUrl } = employeeDetails;
            return {
              employeeId,
              companyId,
              fullName: employeeFullName,
              positionTitle,
              scheduleBase,
              avatarUrl: photoUrl,
              assignment: assignment.name,
              isAccomplishmentSubmitted,
              accomplishmentStatus: status,
            };
          })
        )) as [];

        return { ...rest, immediateSupervisorName, employees: employeesDetails };
      })
    );
  }

  async getOvertimeApplicationsByManagerId(managerId: string) {

    try {
      const employeeId = await this.overtimeApplicationService.crud().findOneOrNull({ find: { select: { managerId: true }, where: { managerId } } });

      if (employeeId.managerId === null) throw new NotFoundException();

      const supervisorId = await this.employeeService.getEmployeeSupervisorId(employeeId.managerId);

      const supervisorName = (await this.employeeService.getEmployeeDetails(supervisorId)).employeeFullName;

      const approvedOvertimes = await this.getOvertimeApplicationsByManagerIdAndStatus(managerId, OvertimeStatus.APPROVED);

      const forApprovalOvertimes = await this.getOvertimeApplicationsByManagerIdAndStatus(managerId, OvertimeStatus.PENDING);

      const cancelledOvertimes = await this.getOvertimeApplicationsByManagerIdAndStatus(managerId, OvertimeStatus.CANCELLED);

      const disapprovedOvertimes = await this.getOvertimeApplicationsByManagerIdAndStatus(managerId, OvertimeStatus.DISAPPROVED);

      const completedOvertimes = [...approvedOvertimes, ...cancelledOvertimes, ...disapprovedOvertimes].sort((a, b) =>
        a.plannedDate > b.plannedDate ? -1 : a.plannedDate < b.plannedDate ? 1 : 0
      );

      const approvedOvertimesWithEmployees = await this.getOvertimeEmployeeDetails(completedOvertimes);
      const forApprovalOvertimesWithEmployees = await this.getOvertimeEmployeeDetails(forApprovalOvertimes);

      return {
        supervisorName,
        overtimes: [...approvedOvertimesWithEmployees, ...forApprovalOvertimesWithEmployees].sort((a, b) =>
          a.status > b.status ? -1 : a.status < b.status ? 1 : 0
        )
      };
    }
    catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getOvertimeApplicationsByImmediateSupervisorId(id: string) {
    try {
      const employeeId = await this.overtimeImmediateSupervisorService.crud().findOne({ find: { select: { employeeId: true }, where: { id } } });

      const supervisorId = await this.employeeService.getEmployeeSupervisorId(employeeId.employeeId);

      const supervisorName = (await this.employeeService.getBasicEmployeeDetails(supervisorId)).employeeFullName;

      const approvedOvertimes = await this.getOvertimeApplicationsBySupervisorIdAndStatus(id, OvertimeStatus.APPROVED);

      const forApprovalOvertimes = await this.getOvertimeApplicationsBySupervisorIdAndStatus(id, OvertimeStatus.PENDING);

      const cancelledOvertimes = await this.getOvertimeApplicationsBySupervisorIdAndStatus(id, OvertimeStatus.CANCELLED);

      const disapprovedOvertimes = await this.getOvertimeApplicationsBySupervisorIdAndStatus(id, OvertimeStatus.DISAPPROVED);

      const completedOvertimes = [...approvedOvertimes, ...cancelledOvertimes, ...disapprovedOvertimes].sort((a, b) =>
        a.plannedDate > b.plannedDate ? -1 : a.plannedDate < b.plannedDate ? 1 : 0
      );

      const approvedOvertimesWithEmployees = await this.getOvertimeEmployeeDetails(completedOvertimes);
      const forApprovalOvertimesWithEmployees = await this.getOvertimeEmployeeDetails(forApprovalOvertimes);

      return {
        supervisorName,
        overtimes: [...approvedOvertimesWithEmployees, ...forApprovalOvertimesWithEmployees].sort((a, b) =>
          a.status > b.status ? -1 : a.status < b.status ? 1 : 0
        )
      };
    }
    catch (error) {
      throw new NotFoundException(error.message);
    }

  }

  async getOvertimeApplications() {
    try {
      const overtimes = (
        (await this.overtimeApplicationService.crud().findAll({
          find: {
            select: {
              id: true,
              plannedDate: true,
              estimatedHours: true,
              purpose: true,
              status: true,
              overtimeImmediateSupervisorId: { employeeId: true },
              managerId: true,
            },
            where: {
              createdAt: Between(
                dayjs(dayjs().subtract(2, 'month').format('YYYY-MM') + '-01').toDate(),
                dayjs(dayjs().format('YYYY-MM') + '-' + dayjs().daysInMonth()).toDate()
              ),
            },
            order: { plannedDate: 'DESC', status: 'DESC' },
            relations: { overtimeImmediateSupervisorId: true },
          },
        })) as OvertimeApplication[]
      ).map((oa) => {
        const { plannedDate, ...restOfOa } = oa;
        return { plannedDate: dayjs(plannedDate).format('YYYY-MM-DD'), ...restOfOa };
      });

      const result = await Promise.all(
        overtimes.map(async (overtime, idx) => {
          const { overtimeImmediateSupervisorId, ...rest } = overtime;
          const overtimeId = rest.id;

          const overtimeApproval = (
            await this.overtimeApplicationService.rawQuery(
              `SELECT approved_by approvedBy, DATE_FORMAT(date_approved, '%Y-%m-%d %H:%i:%s') dateApproved 
              FROM overtime_approval WHERE overtime_application_id_fk = ?;`,
              [rest.id]
            )
          )[0] as { approvedBy: string; dateApproved: Date };
          const { approvedBy, dateApproved } = overtimeApproval;
          const employees = (await this.overtimeEmployeeService.crud().findAll({
            find: {
              select: { employeeId: true },
              where: { overtimeApplicationId: { id: rest.id } },
            },
          })) as { employeeId: string }[];

          const _approvedBy = approvedBy === null ? null : (await this.employeeService.getBasicEmployeeDetails(approvedBy)).employeeFullName;

          const _immediateSupervisorId = overtimeImmediateSupervisorId === null ? overtime.managerId : overtimeImmediateSupervisorId.employeeId;

          const immediateSupervisorName = await this.employeeService.getEmployeeName(_immediateSupervisorId);

          const _employeesDetails = (await Promise.all(
            employees.map(async (employee) => {
              const { employeeId } = employee;

              const employeeDetails = await this.employeeService.getBasicEmployeeDetails(employeeId);

              const employeeSchedules = await this.employeeScheduleService.getAllEmployeeSchedules(employeeId);

              const scheduleBase = employeeSchedules !== null && employeeSchedules.length > 0 ? employeeSchedules[0].scheduleBase : null;

              const { companyId, employeeFullName, positionTitle, assignment, photoUrl } = employeeDetails;
              const { isAccomplishmentSubmitted, status } = (
                await this.employeeScheduleService.rawQuery(
                  `
              SELECT IF(accomplishments IS NOT NULL,true,false) isAccomplishmentSubmitted, oa.status status 
                FROM overtime_accomplishment oa 
                INNER JOIN overtime_employee oe ON oe.overtime_employee_id = oa.overtime_employee_id_fk 
              WHERE oe.employee_id_fk = ? AND oe.overtime_application_id_fk = ?;`,
                  [employeeId, overtime.id]
                )
              )[0];

              return {
                employeeId,
                companyId,
                fullName: employeeFullName,
                positionTitle,
                scheduleBase,
                avatarUrl: photoUrl,
                assignment: assignment.name,
                isAccomplishmentSubmitted,
                accomplishmentStatus: status,
              };
            })
          )) as unknown[];

          return { ...rest, approvedBy: _approvedBy, dateApproved, immediateSupervisorName, employees: _employeesDetails };
        })
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error.message);
    }
  }

  async getOvertimeApplicationsByMonth(yearMonth: string) {
    try {
      const overtimes = (
        (await this.overtimeApplicationService.crud().findAll({
          find: {
            select: {
              id: true,
              plannedDate: true,
              estimatedHours: true,
              purpose: true,
              status: true,
              overtimeImmediateSupervisorId: { employeeId: true },
              managerId: true,
            },
            where: {
              createdAt: Between(dayjs(yearMonth + '-01').toDate(), dayjs(yearMonth + '-' + dayjs(yearMonth + '-01').daysInMonth()).toDate()),
            },
            order: { plannedDate: 'DESC', status: 'DESC' },
            relations: { overtimeImmediateSupervisorId: true },
          },
        })) as OvertimeApplication[]
      ).map((oa) => {
        const { plannedDate, ...restOfOa } = oa;
        return { plannedDate: dayjs(plannedDate).format('YYYY-MM-DD'), ...restOfOa };
      });

      const result = await Promise.all(
        overtimes.map(async (overtime, idx) => {
          const { overtimeImmediateSupervisorId, ...rest } = overtime;
          const overtimeId = rest.id;

          const overtimeApproval = (
            await this.overtimeApplicationService.rawQuery(
              `SELECT approved_by approvedBy, DATE_FORMAT(date_approved, '%Y-%m-%d %H:%i:%s') dateApproved 
              FROM overtime_approval WHERE overtime_application_id_fk = ?;`,
              [rest.id]
            )
          )[0] as { approvedBy: string; dateApproved: Date };
          const { approvedBy, dateApproved } = overtimeApproval;
          const employees = (await this.overtimeEmployeeService.crud().findAll({
            find: {
              select: { employeeId: true },
              where: { overtimeApplicationId: { id: rest.id } },
            },
          })) as { employeeId: string }[];

          const _approvedBy = approvedBy === null ? null : (await this.employeeService.getEmployeeDetails(approvedBy)).employeeFullName;

          const _immediateSupervisorId = overtimeImmediateSupervisorId === null ? overtime.managerId : overtimeImmediateSupervisorId.employeeId;

          const immediateSupervisorName = await this.employeeService.getEmployeeName(_immediateSupervisorId);

          const _employeesDetails = (await Promise.all(
            employees.map(async (employee) => {
              const { employeeId } = employee;

              const employeeDetails = await this.employeeService.getBasicEmployeeDetails(employeeId);

              const employeeSchedules = await this.employeeScheduleService.getAllEmployeeSchedules(employeeId);

              const scheduleBase = employeeSchedules !== null && employeeSchedules.length > 0 ? employeeSchedules[0].scheduleBase : null;

              const { companyId, employeeFullName, positionTitle, assignment, photoUrl } = employeeDetails;
              const { isAccomplishmentSubmitted, status } = (
                await this.employeeScheduleService.rawQuery(
                  `
              SELECT IF(accomplishments IS NOT NULL,true,false) isAccomplishmentSubmitted, oa.status status 
                FROM overtime_accomplishment oa 
                INNER JOIN overtime_employee oe ON oe.overtime_employee_id = oa.overtime_employee_id_fk 
              WHERE oe.employee_id_fk = ? AND oe.overtime_application_id_fk = ?;`,
                  [employeeId, overtime.id]
                )
              )[0];

              return {
                employeeId,
                companyId,
                fullName: employeeFullName,
                positionTitle,
                scheduleBase,
                avatarUrl: photoUrl,
                assignment: assignment.name,
                isAccomplishmentSubmitted,
                accomplishmentStatus: status,
              };
            })
          )) as unknown[];

          return { ...rest, approvedBy: _approvedBy, dateApproved, immediateSupervisorName, employees: _employeesDetails };
        })
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error.message);
    }
  }

  async getImmediateSupervisorList() {
    const supervisors = (await this.overtimeImmediateSupervisorService
      .crud()
      .findAll({ find: { select: { id: true, employeeId: true } } })) as OvertimeImmediateSupervisor[];

    const employeeList = await Promise.all(
      supervisors.map(async (supervisor) => {
        const { employeeId, id } = supervisor;
        const employeeDetails = await this.employeeService.getEmployeeDetails(employeeId);

        const { assignment, employeeFullName, photoUrl } = employeeDetails;
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
    const restDays = employeeSchedules !== null ? employeeSchedules[0].restDays : null;
    const employeeDetails = await this.employeeService.getEmployeeDetails(employeeId);

    const overtimeDetails = (await this.overtimeAccomplishmentService.crud().findOne({
      find: {
        where: { overtimeEmployeeId: { employeeId, overtimeApplicationId: { id: overtimeApplicationId } } },
        relations: { overtimeEmployeeId: { overtimeApplicationId: true } },
      },
    })) as OvertimeAccomplishment;

    const supervisorId = (await this.employeeService.getEmployeeSupervisorId(employeeId)).toString();

    const supervisorEmployeeSignatures = await this.employeeService.getEmployeeAndSupervisorName(employeeId, supervisorId);

    const { createdAt, updatedAt, deletedAt, ...rest } = overtimeDetails;

    const { id, ...restOfOvertimeApplication } = overtimeDetails.overtimeEmployeeId.overtimeApplicationId;

    let didFaceScan = null;
    let dtr = null;

    dtr = await this.dailyTimeRecordService.getDtrByCompanyIdAndDay({
      companyId: employeeDetails.companyId,
      date: dayjs(overtimeDetails.overtimeEmployeeId.overtimeApplicationId.plannedDate).toDate(),
    });

    if (scheduleBase === ScheduleBase.OFFICE) {
      didFaceScan = await this.dailyTimeRecordService.getHasIvms({
        companyId: employeeDetails.companyId.replace('-', ''),
        entryDate: rest.overtimeEmployeeId.overtimeApplicationId.plannedDate,
      });
      if (didFaceScan) {
        dtr = await this.dailyTimeRecordService.getDtrByCompanyIdAndDay({
          companyId: employeeDetails.companyId,
          date: dayjs(overtimeDetails.overtimeEmployeeId.overtimeApplicationId.plannedDate).toDate(),
        });
      }
    }

    const updatedOvertimeDetails = (await this.overtimeAccomplishmentService.crud().findOne({
      find: {
        select: {
          id: true,
          encodedTimeIn: true,
          encodedTimeOut: true,
          accomplishments: true,
          actualHrs: true,
          approvedBy: true,
          status: true,
          remarks: true,
          overtimeEmployeeId: { id: true, overtimeApplicationId: { estimatedHours: true, plannedDate: true } },
        },
        where: { overtimeEmployeeId: { employeeId, overtimeApplicationId: { id: overtimeApplicationId } } },
        relations: { overtimeEmployeeId: { overtimeApplicationId: true } },
      },
    })) as OvertimeAccomplishment;
    const { overtimeEmployeeId, approvedBy, ...restOfUpdatedOvertime } = updatedOvertimeDetails;
    const estimatedHours = overtimeEmployeeId.overtimeApplicationId.estimatedHours;
    const _approvedBy =
      approvedBy === null || approvedBy === '' ? null : (await this.employeeService.getEmployeeDetails(approvedBy)).employeeFullName;
    const entries = await this.dailyTimeRecordService.getEntriesTheDayAndTheNext({
      companyId: employeeDetails.companyId,
      date: restOfOvertimeApplication.plannedDate,
    });

    let computedEncodedHours = null;
    const plannedDate = updatedOvertimeDetails.overtimeEmployeeId.overtimeApplicationId.plannedDate;

    if (updatedOvertimeDetails.encodedTimeIn !== null && updatedOvertimeDetails.encodedTimeOut !== null) {
      if (dayjs(plannedDate).day() in restDays) {
        computedEncodedHours =
          ((dayjs(updatedOvertimeDetails.encodedTimeOut).diff(dayjs(updatedOvertimeDetails.encodedTimeIn), 'minute') / 60 + Number.EPSILON) * 100) /
          100;
        computedEncodedHours = Math.round((computedEncodedHours + Number.EPSILON) * 100) / 100;
      } else {
        //get overtime after schedule
        computedEncodedHours =
          ((dayjs(updatedOvertimeDetails.encodedTimeOut).diff(dayjs(updatedOvertimeDetails.encodedTimeIn), 'minute') / 60 + Number.EPSILON) * 100) /
          100;

        computedEncodedHours = Math.round((computedEncodedHours + Number.EPSILON) * 100) / 100;
      }
      if (computedEncodedHours > 4) {
        computedEncodedHours =
          dtr.schedule.lunchOut !== null
            ? (this.getComputedHours(computedEncodedHours) * 100) / 100
            : (this.getComputedHours(computedEncodedHours) * 100) / 100;
      }
    }

    return {
      ...restOfUpdatedOvertime,
      ...supervisorEmployeeSignatures,
      entriesForTheDay: entries,
      plannedDate,
      approvedBy: _approvedBy,
      didFaceScan,
      estimatedHours: estimatedHours === null ? null : estimatedHours,
      computedEncodedHours: computedEncodedHours > 0 ? computedEncodedHours : 0,
    };
  }

  async updateOvertimeAccomplishment(updateOvertimeAccomplishmentDto: UpdateOvertimeAccomplishmentDto) {
    const { employeeId, overtimeApplicationId, ...overtimeAccomplishmentDto } = updateOvertimeAccomplishmentDto;

    const _overtimeApplicationId = overtimeApplicationId.id ? overtimeApplicationId.id : overtimeApplicationId;
    const id = (
      await this.overtimeAccomplishmentService.rawQuery(
        `
    SELECT oa.overtime_accomplishment id FROM overtime_accomplishment oa INNER JOIN overtime_employee oe ON oa.overtime_employee_id_fk = oe.overtime_employee_id WHERE employee_id_fk=? AND overtime_application_id_fk = ?;`,
        [employeeId, _overtimeApplicationId]
      )
    )[0];

    const result = await this.overtimeAccomplishmentService.crud().update({
      dto: {
        ...overtimeAccomplishmentDto,
        approvedBy:
          typeof overtimeAccomplishmentDto.approvedBy === 'undefined' || overtimeAccomplishmentDto.approvedBy === null
            ? null
            : overtimeAccomplishmentDto.approvedBy,
        dateApproved: dayjs().toDate(),
      },
      updateBy: {
        id: id.id,
      },
    });

    if (result.affected > 0) return updateOvertimeAccomplishmentDto;
  }

  async updateAllOvertimeAccomplishment(updateAllOvertimeAccomplishmentDto: UpdateAllOvertimeAccomplishmentDto) {
    const { employeeIds, overtimeApplicationId, ...restOfOvertimeAccomplishmentDto } = updateAllOvertimeAccomplishmentDto;
    const updatedOvertimeAccomplishments = await Promise.all(
      employeeIds.map(async (employeeId) => {
        const id = (
          await this.overtimeAccomplishmentService.rawQuery(
            `
              SELECT oa.overtime_accomplishment id 
                FROM overtime_accomplishment oa 
              INNER JOIN overtime_employee oe ON oa.overtime_employee_id_fk = oe.overtime_employee_id 
              WHERE employee_id_fk=? AND overtime_application_id_fk = ?;`,
            [employeeId, overtimeApplicationId]
          )
        )[0];
        const result = await this.overtimeAccomplishmentService.crud().update({
          dto: { ...restOfOvertimeAccomplishmentDto, dateApproved: dayjs().toDate() },
          updateBy: {
            id: id.id,
          },
        });
        if (result.affected > 0) return { employeeId, ...restOfOvertimeAccomplishmentDto };
      })
    );
    return updatedOvertimeAccomplishments;
  }

  async getEmployeeListBySupervisorId(employeeId: string) {
    const employeeDetails = await this.employeeService.getEmployeeDetails(employeeId);
    const orgId = employeeDetails.assignment.id;
    const employeeSupervisor = await this.overtimeImmediateSupervisorService.crud().findOneOrNull({
      find: { select: { orgId: true }, where: { employeeId } },
    });

    if (
      employeeSupervisor !== null ||
      employeeDetails.userRole === 'department_manager' ||
      employeeDetails.userRole === 'oic_department_manager' ||
      employeeDetails.userRole === 'division_manager' ||
      employeeDetails.userRole === 'oic_division_manager' ||
      employeeDetails.userRole === 'assistant_general_manager' ||
      employeeDetails.userRole === 'oic_assistant_general_manager' ||
      employeeDetails.userRole === 'oic_general_manager' ||
      employeeDetails.userRole === 'general_manager'
    )
      return await this.employeeService.getEmployeesByOrgId(orgId);
    else throw new HttpException('You are not an immediate supervisor or a manager.', HttpStatus.FORBIDDEN);
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

  async approveOvertime(updateOvertimeApprovalDto: UpdateOvertimeApprovalDto) {
    const { overtimeApplicationId, status, ...restOfOvertimeApprovalDto } = updateOvertimeApprovalDto;
    const overtimeApplication = await this.overtimeApplicationService.crud().update({
      dto: { status },
      updateBy: { id: overtimeApplicationId },
    });

    if (overtimeApplication.affected > 0) {
      const overtimeApproval = await this.overtimeApprovalService.crud().update({
        dto: { ...restOfOvertimeApprovalDto, dateApproved: dayjs().toDate() },
        updateBy: { overtimeApplicationId: { id: overtimeApplicationId } },
      });
      if (overtimeApproval.affected > 0) return updateOvertimeApprovalDto;
    }
    return {};
  }

  async updateAccomplishments(updateOvertimeAccomplishmentByEmployeeDto: UpdateOvertimeAccomplishmentByEmployeeDto) {
    const { employeeId, overtimeApplicationId, accomplishments } = updateOvertimeAccomplishmentByEmployeeDto;
    const overtimeEmployeeId = await this.overtimeEmployeeService
      .crud()
      .findOne({ find: { select: { id: true }, where: { overtimeApplicationId: { id: overtimeApplicationId }, employeeId } } });

    const result = await this.overtimeAccomplishmentService.crud().update({
      dto: { accomplishments },
      updateBy: { overtimeEmployeeId: { id: overtimeEmployeeId.id } },
    });

    if (result.affected > 0) return updateOvertimeAccomplishmentByEmployeeDto;
  }

  private async getOvertimesByEmployeeIdAndStatus(employeeId: string, status: OvertimeStatus) {
    try {
      const overtimes = (await this.overtimeEmployeeService.crud().findAll({
        find: {
          select: {
            overtimeApplicationId: {
              id: true,
              estimatedHours: true,
              managerId: true,
              plannedDate: true,
              purpose: true,
              status: true,
              overtimeImmediateSupervisorId: { employeeId: true },
            },
          },
          order: { overtimeApplicationId: { plannedDate: 'DESC' } },
          where: { employeeId, overtimeApplicationId: { status } },
          relations: { overtimeApplicationId: true },
        },
      })) as OvertimeEmployee[];

      const result = await Promise.all(
        overtimes.map(async (overtimeEmployee) => {
          const {
            overtimeApplicationId: { createdAt, deletedAt, updatedAt, ...restOfOvertimes },
          } = overtimeEmployee;
          return restOfOvertimes;
        })
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getOvertimesByEmployeeId(employeeId: string) {
    const pending = await this.getOvertimesByEmployeeIdAndStatus(employeeId, OvertimeStatus.PENDING);
    const disapproved = await this.getOvertimesByEmployeeIdAndStatus(employeeId, OvertimeStatus.DISAPPROVED);
    const approved = await this.getOvertimesByEmployeeIdAndStatus(employeeId, OvertimeStatus.APPROVED);

    return {
      completed: { approved, disapproved },
      forApproval: pending,
    };
  }

  async getOvertimeAccomplishmentByEmployeeId(employeeId: string) {
    //!TODO refactor this

    try {
      const supervisorId = await this.employeeService.getEmployeeSupervisorId(employeeId);

      const supervisorName = (await this.employeeService.getEmployeeDetails(supervisorId)).employeeFullName;

      const pendingOvertimes = (await this.overtimeAccomplishmentService.crud().findAll({
        find: {
          select: {
            overtimeEmployeeId: {
              id: true,
              employeeId: true,
              overtimeApplicationId: { id: true, status: true, purpose: true, plannedDate: true, estimatedHours: true },
            },
            remarks: true,
            status: true,
            approvedBy: true,
            dateApproved: true,
            accomplishments: true,
            encodedTimeIn: true,
            ivmsTimeIn: true,
            ivmsTimeOut: true,
            encodedTimeOut: true,
            actualHrs: true,
            id: true,
          },
          where: {
            overtimeEmployeeId: { employeeId, overtimeApplicationId: { status: OvertimeStatus.APPROVED } },
            status: OvertimeStatus.PENDING,
          },
          relations: { overtimeEmployeeId: { overtimeApplicationId: true } },
          order: { overtimeEmployeeId: { overtimeApplicationId: { plannedDate: 'DESC' } } },
          loadRelationIds: true,
          loadEagerRelations: true,
          relationLoadStrategy: 'query',
        },
        onError: () => new NotFoundException(),
      })) as OvertimeAccomplishment[];

      const pendingResult = await Promise.all(
        pendingOvertimes.map(async (overtime) => {
          const { overtimeEmployeeId, remarks, status } = overtime;

          const { overtimeApplicationId, employeeId } = overtimeEmployeeId;
          const { estimatedHours, plannedDate, purpose } = overtimeApplicationId;

          const dateOfOTApproval = dayjs(
            (await this.overtimeApprovalService.crud().findAll({ find: { select: { dateApproved: true }, where: { overtimeApplicationId } } }))[0]
              .dateApproved
          ).format('YYYY-MM-DD');

          const overtimeAccomplishmentDetails = await this.getOvertimeDetails(employeeId, overtimeApplicationId.id);

          return {
            supervisorName,
            ...overtimeAccomplishmentDetails,
            overtimeApplicationId: overtimeApplicationId.id,
            estimatedHours,
            dateOfOTApproval,
            plannedDate,
            employeeId,
            purpose,
            remarks,
            status,
          };
        })
      );

      const approvedOvertimes = (await this.overtimeAccomplishmentService.crud().findAll({
        find: {
          select: {
            overtimeEmployeeId: {
              id: true,
              employeeId: true,
              overtimeApplicationId: { id: true, status: true, purpose: true, plannedDate: true, estimatedHours: true },
            },
            remarks: true,
            status: true,
            actualHrs: true,
            ivmsTimeIn: true,
            ivmsTimeOut: true,
            accomplishments: true,
            id: true,
          },
          where: {
            overtimeEmployeeId: { employeeId, overtimeApplicationId: { status: OvertimeStatus.APPROVED } },
            status: OvertimeStatus.APPROVED,
          },
          relations: { overtimeEmployeeId: { overtimeApplicationId: true } },
          order: { overtimeEmployeeId: { overtimeApplicationId: { plannedDate: 'DESC' } } },
          loadRelationIds: true,
          loadEagerRelations: true,
          relationLoadStrategy: 'query',
        },
        onError: () => new NotFoundException(),
      })) as OvertimeAccomplishment[];

      const approvedResult = await Promise.all(
        approvedOvertimes.map(async (overtime) => {
          const { overtimeEmployeeId, remarks, status } = overtime;

          const { overtimeApplicationId, employeeId } = overtimeEmployeeId;
          const { estimatedHours, plannedDate, purpose } = overtimeApplicationId;

          const overtimeAccomplishmentDetails = await this.getOvertimeDetails(employeeId, overtimeApplicationId.id);

          const dateOfOTApproval = dayjs(
            (await this.overtimeApprovalService.crud().findAll({ find: { select: { dateApproved: true }, where: { overtimeApplicationId } } }))[0]
              .dateApproved
          ).format('YYYY-MM-DD');

          return {
            ...overtimeAccomplishmentDetails,
            overtimeApplicationId: overtimeApplicationId.id,
            estimatedHours,
            plannedDate,
            dateOfOTApproval,
            employeeId,
            purpose,
            remarks,
            status,
          };
        })
      );

      return { forApproval: pendingResult, completed: approvedResult };
    } catch (error) {
      throw new HttpException(error, error.message);
    }
  }

  async deleteImmediateSupervisor(id: string) {
    const deleteResult = await this.overtimeImmediateSupervisorService.crud().delete({
      deleteBy: { id },
      softDelete: false,
      onError: (error: { error: { errno: number }; metadata: EntityMetadata }) => {
        if (error.error.errno === 1451) throw new HttpException('Supervisor currently has ongoing overtime application/s', HttpStatus.BAD_REQUEST);
        else throw new InternalServerErrorException();
      },
    });
    if (deleteResult.affected > 0) return { deletedImmediateSupervisor: id };
    throw new InternalServerErrorException();
  }

  //#region Reports
  async getOvertimeAuthorization(overtimeApplicationId: string, immediateSupervisorEmployeeId: string) {
    //

    const overtimeApplication = (
      await this.overtimeApplicationService.rawQuery(
        `
        SELECT DATE_FORMAT(oa.created_at,'%m-%d-%Y') requestedDate, 
        purpose, 
        planned_date plannedDate, 
        estimated_hours estimatedHours, 
        status, 
        DATE_FORMAT(oappr.date_approved,'%m-%d-%Y') managerApprovalDate
        FROM overtime_application oa 
        LEFT JOIN overtime_immediate_supervisor ois ON ois.overtime_immediate_supervisor_id = oa.overtime_immediate_supervisor_id_fk 
        INNER JOIN overtime_approval oappr ON oappr.overtime_application_id_fk = oa.overtime_application_id 
        WHERE  oa.overtime_application_id = ? AND (ois.employee_id_fk = ? OR oa.manager_id_fk = ? )
    `,
        [overtimeApplicationId, immediateSupervisorEmployeeId, immediateSupervisorEmployeeId]
      )
    )[0];

    const overtimeEmployees = (await this.overtimeApprovalService.rawQuery(
      `SELECT overtime_employee_id overtimeEmployeeId,employee_id_fk employeeId FROM overtime_employee WHERE overtime_application_id_fk = ?`,
      [overtimeApplicationId]
    )) as {
      overtimeEmployeeId: string;
      employeeId: string;
    }[];

    const employees = await Promise.all(
      overtimeEmployees.map(async (overtimeEmployee) => {
        const employeeDetails = await this.employeeService.getEmployeeDetails(overtimeEmployee.employeeId);
        const { assignment, companyId, employeeFullName, userId } = employeeDetails;
        return {
          overtimeEmployeeId: overtimeEmployee.overtimeEmployeeId,
          companyId,
          employeeId: userId,
          name: employeeFullName,
          assignment: assignment.name,
          position: assignment.positionTitle,
        };
      })
    );

    const managerId = (await this.employeeService.getEmployeeSupervisorId(immediateSupervisorEmployeeId)).toString();
    const supervisorAndManagerNames = await this.employeeService.getEmployeeAndSupervisorName(immediateSupervisorEmployeeId, managerId);

    const supervisorPosition = await (await this.employeeService.getEmployeeDetails(managerId)).assignment.positionTitle;

    return { ...overtimeApplication, employees, signatories: { ...supervisorAndManagerNames, supervisorPosition } };
  }


  async getOvertimeAuthorizationAccomplishmentSummary(
    immediateSupervisorEmployeeId: string,
    year: number,
    month: number,
    half: ReportHalf,
    _natureOfAppointment: string
  ) {
    try {
      const numOfDays = dayjs(year + '-' + month + '-1').daysInMonth();
      const days =
        half === ReportHalf.FIRST_HALF ? getDayRange1stHalf() : half === ReportHalf.SECOND_HALF ? getDayRange2ndHalf(numOfDays) : [];
      const _month = ('0' + month).slice(-2);
      const periodCovered = dayjs(year + '-' + month + '-1').format('MMMM') + ' ' + days[0] + '-' + days[days.length - 1] + ', ' + year;

      const result = await this.overtimeApplicationService.rawQuery(`
          SELECT DISTINCT 
            emp.company_id companyId,
              hris_prod.get_employee_fullname2(oe.employee_id_fk) employeeName,
              hris_prod.get_employee_assignment(oe.employee_id_fk) assignment,
              DATE_FORMAT(oappl.planned_date, '%Y-%m-%d') plannedDate,
              DATE_FORMAT(oappl.created_at, '%Y-%m-%d') applicationDate,
              oappl.purpose purpose,
              oacc.accomplishments accomplishments,
              oappl.estimated_hours estimatedHours,
              oacc.actual_hours actualHours,
              oappl.status otStatus,
              oacc.status accomplishmentStatus
          FROM overtime_application oappl
              INNER JOIN overtime_approval oappr ON oappr.overtime_application_id_fk = oappl.overtime_application_id
              INNER JOIN overtime_employee oe ON oe.overtime_application_id_fk = oappl.overtime_application_id
              INNER JOIN overtime_accomplishment oacc ON oacc.overtime_employee_id_fk = oe.overtime_employee_id
              INNER JOIN hris_prod.employees emp ON emp._id = oe.employee_id_fk
              INNER JOIN hris_prod.plantilla_positions pp ON pp.employee_id_fk = emp._id
              LEFT JOIN overtime_immediate_supervisor ois ON ois.overtime_immediate_supervisor_id = oappl.overtime_immediate_supervisor_id_fk
          WHERE oappl.status <> 'cancelled' 
              AND (ois.employee_id_fk = ? OR oappl.manager_id_fk = ?)
              AND date_format(planned_date,'%Y')=? 
              AND date_format(planned_date,'%m') = ? 
              AND date_format(planned_date,'%d') IN (?) 
              AND pp.nature_of_appointment = ?
          ORDER BY plannedDate ASC, otStatus ASC, accomplishmentStatus ASC; 
        `, [immediateSupervisorEmployeeId, immediateSupervisorEmployeeId, year, _month, days, _natureOfAppointment]);


      const preparedByDetails = await this.employeeService.getBasicEmployeeDetails(immediateSupervisorEmployeeId);
      const preparedByPosition = preparedByDetails.assignment.positionTitle;
      const orgName = preparedByDetails.assignment.name;

      const notedByEmployeeId = await this.employeeService.getEmployeeSupervisorId(immediateSupervisorEmployeeId);
      const approvedByEmployeeId = await this.employeeService.getEmployeeSupervisorId(notedByEmployeeId.toString());

      const preparedByAndNotedBy = await this.employeeService.getEmployeeAndSupervisorName(immediateSupervisorEmployeeId, notedByEmployeeId.toString());
      const approvedBy = await this.employeeService.getEmployeeAndSupervisorName(notedByEmployeeId.toString(), approvedByEmployeeId.toString());

      const notedByPosition = (await this.employeeService.getBasicEmployeeDetails(notedByEmployeeId.toString())).assignment.positionTitle;
      const approvedByPosition = (await this.employeeService.getBasicEmployeeDetails(approvedByEmployeeId.toString())).assignment.positionTitle;

      const { employeeName, employeeSignature, supervisorName, supervisorSignature } = preparedByAndNotedBy;

      return {
        periodCovered,
        orgName,
        summary: result,
        signatories: {
          preparedBy: { name: employeeName, signature: employeeSignature, position: preparedByPosition },
          notedBy: { name: supervisorName, signature: supervisorSignature, position: notedByPosition },
          approvedBy: { name: approvedBy.supervisorName, signature: approvedBy.supervisorSignature, position: approvedByPosition },
        },
      };
    }
    catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getOvertimeSummaryRegular(
    immediateSupervisorEmployeeId: string,
    year: number,
    month: number,
    half: ReportHalf,
    _natureOfAppointment: string
  ) {
    const numOfDays = dayjs(year + '-' + month + '-1').daysInMonth();

    const _month = ('0' + month).slice(-2);

    let overallTotalRegularOTAmount = 0;
    let overallTotalOffOTAmount = 0;
    let overallNightDifferentialAmount = 0;
    let overallTotalOTAmount = 0;
    let overallSubstituteDutyOTAmount = 0;

    const days =
      half === ReportHalf.FIRST_HALF ? getDayRange1stHalf() : half === ReportHalf.SECOND_HALF ? getDayRange2ndHalf(numOfDays) : [];

    const periodCovered = dayjs(year + '-' + month + '-1').format('MMMM') + ' ' + days[0] + '-' + days[days.length - 1] + ', ' + year;
    const employees = (await this.overtimeApplicationService.rawQuery(
      `
      SELECT DISTINCT oe.employee_id_fk employeeId, oe.salary_grade_amount salaryGradeAmount,oe.daily_rate dailyRate FROM overtime_employee oe 
        INNER JOIN overtime_application oa ON oa.overtime_application_id = oe.overtime_application_id_fk 
        INNER JOIN overtime_immediate_supervisor ois ON ois.overtime_immediate_supervisor_id = oa.overtime_immediate_supervisor_id_fk 
        INNER JOIN overtime_accomplishment oacc ON oacc.overtime_employee_id_fk = oe.overtime_employee_id 
      WHERE date_format(planned_date,'%Y')=? AND date_format(planned_date,'%m') = ? AND date_format(planned_date,'%d') IN (?) 
      AND ois.employee_id_fk = ? 
      AND oacc.status IN ('approved','pending') 
    ;`,
      [year, _month, days, immediateSupervisorEmployeeId]
    )) as { employeeId: string; salaryGradeAmount: number; dailyRate: number }[];

    const employeeDetails = await Promise.all(
      employees.map(async (employee) => {
        let totalRegularOTHoursRendered = 0;
        let totalOffOTHoursRendered = 0;
        //check if regular employee
        const natureOfAppointment = await this.employeeService.getEmployeeNatureOfAppointment(employee.employeeId);
        if (
          natureOfAppointment !== _natureOfAppointment
          //&& natureOfAppointment !== 'casual'
        )
          return null;
        const details = await this.employeeService.getEmployeeDetails(employee.employeeId);

        const hourlyMonthlyRate = {
          hourlyRate:
            _natureOfAppointment === 'permanent' || _natureOfAppointment === 'casual' ? employee.salaryGradeAmount / 22 / 8 : employee.dailyRate / 8,
          monthlyRate:
            _natureOfAppointment === 'permanent' || _natureOfAppointment === 'casual' ? employee.salaryGradeAmount : employee.dailyRate * 22,
        };

        const { employeeFullName, userId, assignment } = details;
        const { positionId } = assignment;
        const overtimes = await Promise.all(
          days.map(async (_day) => {
            const empSched = await this.isRegularOvertimeDay(employee.employeeId, year, month, _day);
            //!TODO get every overtime of the employee on specific year and month on specified days in the half chosen
            try {
              const overtime = (await this.overtimeApplicationService.rawQuery(
                `
              SELECT date_format(planned_date,'%d') \`day\`,
              oa.overtime_application_id overtimeApplicationId
                FROM overtime_application oa 
              INNER JOIN overtime_employee oe ON oe.overtime_application_id_fk = oa.overtime_application_id 
              INNER JOIN overtime_accomplishment oacc ON oacc.overtime_employee_id_fk = oe.overtime_employee_id 
              LEFT JOIN overtime_immediate_supervisor ois ON ois.overtime_immediate_supervisor_id = oa.overtime_immediate_supervisor_id_fk 
              WHERE date_format(planned_date,'%Y')=? AND date_format(planned_date,'%m') = ? AND  date_format(planned_date,'%d') = ? 
              AND oe.employee_id_fk = ? AND oacc.status IN ('approved','pending') AND (ois.employee_id_fk = ? OR oa.manager_id_fk = ?) 
              ORDER BY \`day\` ASC;
              `,
                [year, _month, _day, employee.employeeId, immediateSupervisorEmployeeId, immediateSupervisorEmployeeId]
              )) as {
                day: number;
                overtimeApplicationId: string;
              }[];

              const overtimeDetails = await Promise.all(
                overtime.map(async (overtimeDetail) => {
                  const { overtimeApplicationId } = overtimeDetail;

                  return { day: _day, ...(await this.getOvertimeDetails(employee.employeeId, overtimeApplicationId)) };
                })
              );

              const {
                day,
                accomplishments,
                createdAt,
                deletedAt,
                didFaceScan,
                employeeName,
                employeeSignature,
                plannedDate,
                remarks,
                status,
                supervisorSignature,
                supervisorName,
                updatedAt,
                id,
                encodedTimeIn,
                encodedTimeOut,
                ivmsTimeIn,
                ivmsTimeOut,
                ...restOfOvertime
              } = overtimeDetails[0];

              const hoursRendered = await this.getComputedHrs(restOfOvertime);

              const suspensionHours = await this.workSuspensionService.getWorkSuspensionBySuspensionDate(
                dayjs(year + '-' + month + '-' + day).toDate()
              );

              if (await this.isRegularOvertimeDay(employee.employeeId, year, month, day)) {
                if (suspensionHours <= 0) totalRegularOTHoursRendered += hoursRendered;
                else totalOffOTHoursRendered += hoursRendered;
              } else totalOffOTHoursRendered += hoursRendered;

              return typeof overtime !== 'undefined'
                ? { day, hoursRendered }
                : {
                  day: Number.parseInt(_day.toString()),
                  hoursRendered: null,
                };
            } catch {
              return {
                day: Number.parseInt(_day.toString()),
                hoursRendered: null,
              };
            }
          })
        );
        const { hourlyRate } = hourlyMonthlyRate;

        const regularMultiplier = natureOfAppointment === 'permanent' || natureOfAppointment === 'casual' ? 1.25 : 1;
        const offMultiplier = natureOfAppointment === 'permanent' || natureOfAppointment === 'casual' ? 1.5 : 1;

        const regularOTAmount = Math.round((hourlyRate * totalRegularOTHoursRendered * regularMultiplier + Number.EPSILON) * 100) / 100;
        const offOTAmount = Math.round((hourlyRate * totalOffOTHoursRendered * offMultiplier + Number.EPSILON) * 100) / 100;
        const totalOTHoursRendered = totalRegularOTHoursRendered + totalOffOTHoursRendered;
        const substituteDutyOTHours = 0;
        const substituteAmount = 0;
        const nightDifferentialHrs = 0;
        const nightDifferentialAmount = 0;
        const totalOvertimeAmount = regularOTAmount + offOTAmount + substituteAmount + nightDifferentialAmount;

        overallTotalRegularOTAmount += regularOTAmount;
        overallTotalOffOTAmount += offOTAmount;
        overallSubstituteDutyOTAmount += substituteAmount;
        overallNightDifferentialAmount += nightDifferentialAmount;
        overallTotalOTAmount += totalOvertimeAmount;

        return {
          employeeFullName,
          userId,
          positionId,
          overtimes,
          ...hourlyMonthlyRate,
          totalOTHoursRendered,
          totalRegularOTHoursRendered,
          totalOffOTHoursRendered,
          regularOTAmount,
          offOTAmount,
          substituteDutyOTHours,
          substituteAmount,
          nightDifferentialHrs,
          nightDifferentialAmount,
          totalOvertimeAmount,
        };
      })
    );
    const filteredEmployeeDetails = [];

    await Promise.all(
      employeeDetails.map(async (employeeDetail) => {
        if (employeeDetail !== null) filteredEmployeeDetails.push(employeeDetail);
      })
    );

    const preparedByPosition = (await this.employeeService.getBasicEmployeeDetails(immediateSupervisorEmployeeId)).assignment.positionTitle;

    const notedByEmployeeId = await this.employeeService.getEmployeeSupervisorId(immediateSupervisorEmployeeId);
    const approvedByEmployeeId = await this.employeeService.getEmployeeSupervisorId(notedByEmployeeId.toString());

    const preparedByAndNotedBy = await this.employeeService.getEmployeeAndSupervisorName(immediateSupervisorEmployeeId, notedByEmployeeId.toString());
    const approvedBy = await this.employeeService.getEmployeeAndSupervisorName(notedByEmployeeId.toString(), approvedByEmployeeId.toString());

    const notedByPosition = (await this.employeeService.getBasicEmployeeDetails(notedByEmployeeId.toString())).assignment.positionTitle;
    const approvedByPosition = (await this.employeeService.getBasicEmployeeDetails(approvedByEmployeeId.toString())).assignment.positionTitle;
    const assignedTo = (await this.employeeService.getBasicEmployeeDetails(immediateSupervisorEmployeeId)).assignment.name;

    const { employeeName, employeeSignature, supervisorName, supervisorSignature } = preparedByAndNotedBy;

    return {
      periodCovered,
      assignedTo,
      summary: filteredEmployeeDetails,
      signatories: {
        preparedBy: { name: employeeName, signature: employeeSignature, position: preparedByPosition },
        notedBy: { name: supervisorName, signature: supervisorSignature, position: notedByPosition },
        approvedBy: { name: approvedBy.supervisorName, signature: approvedBy.supervisorSignature, position: approvedByPosition },
      },
      overallTotalRegularOTAmount,
      overallTotalOffOTAmount,
      overallSubstituteDutyOTAmount,
      overallNightDifferentialAmount,
      overallTotalOTAmount,
    };
  }

  async getIndividualOvertimeAccomplishment(overtimeApplicationId: string, employeeId: string) {
    const employeeDetails = await this.employeeService.getEmployeeDetails(employeeId);
    const assignment = employeeDetails.assignment.name;
    const supervisorId = await this.employeeService.getEmployeeSupervisorId(employeeId);
    const supervisorPosition = (await this.employeeService.getEmployeeDetails(supervisorId.toString())).assignment.positionTitle;
    const { employeeName, employeeSignature, supervisorName, supervisorSignature } = await this.employeeService.getEmployeeAndSupervisorName(
      employeeId,
      supervisorId.toString()
    );
    const overtimeDetails = (
      await this.overtimeAccomplishmentService.rawQuery(
        `
        SELECT DATE_FORMAT(planned_date,'%Y-%m-%d') \`date\`, oacc.accomplishments accomplishments
          FROM overtime_application oapp
        INNER JOIN overtime_employee oe ON oe.overtime_application_id_fk = oapp.overtime_application_id
        INNER JOIN overtime_accomplishment oacc ON oacc.overtime_employee_id_fk = oe.overtime_employee_id
        WHERE oe.employee_id_fk = ? AND oapp.overtime_application_id = ?
      ;`,
        [employeeId, overtimeApplicationId]
      )
    )[0];

    return { ...overtimeDetails, employeeName, assignment, employeeSignature, supervisorName, supervisorSignature, supervisorPosition };
  }
  //#endregion Reports

  private async getComputedHrs(hrsRendered: OvertimeHrsRendered) {
    //
    const { computedEncodedHours, actualHrs } = hrsRendered;
    return actualHrs && actualHrs > 0 ? parseFloat(actualHrs.toString()) : computedEncodedHours;
  }

  private async isRegularOvertimeDay(employeeId: string, year: number, month: number, day: number) {
    const employeeSchedule = await this.employeeScheduleService.getEmployeeSchedule(employeeId);

    const restDays = employeeSchedule.schedule.restDaysNumbers.toString().split(', ');
    const isHoliday = (
      await this.employeeScheduleService.rawQuery(
        `SELECT IF(COUNT(holiday_date)>0,true,false) isHoliday FROM holidays WHERE holiday_date = concat(?,'-',?,'-',?);`,
        [year, month, day]
      )
    )[0].isHoliday;
    const dayOfWeek = dayjs(year + '-' + month + '-' + day)
      .day()
      .toString();
    if (restDays.includes(dayOfWeek) || isHoliday === '1') return false;
    return true;
  }

  async getNotifsOvertimesByEmployeeId(employeeId: string) {
    const overtimes = (await this.overtimeAccomplishmentService.rawQuery(
      `
        SELECT oa.overtime_application_id overtimeApplicationId,
        DATE_FORMAT(oa.planned_date,'%Y-%m-%d') plannedDate,
        purpose, 
        status,
        oa.estimated_hours estimatedHours  
        FROM overtime_application oa 
          INNER JOIN overtime_employee oe ON oe.overtime_application_id_fk = oa.overtime_application_id
        WHERE oe.employee_id_fk = ? 
        AND oa.planned_date BETWEEN DATE_SUB(NOW(),INTERVAL 14 DAY) AND DATE_ADD(NOW(), INTERVAL 14 DAY) 
        ORDER BY oa.planned_date ASC;`,
      [employeeId]
    )) as { overtimeApplicationId: string; plannedDate: Date; purpose: string; status: OvertimeStatus; estimatedHours: number }[];

    const overtimesWithEmployees = await Promise.all(
      overtimes.map(async (overtime) => {
        const { overtimeApplicationId, ...rest } = overtime;
        const employeesWithCurrent = (await this.overtimeAccomplishmentService.rawQuery(
          `
        SELECT employee_id_fk employeeId FROM overtime_employee WHERE overtime_application_id_fk = ? AND employee_id_fk <> ?;
      `,
          [overtimeApplicationId, employeeId]
        )) as { employeeId: string }[];

        const employeeDetails = await Promise.all(
          employeesWithCurrent.map(async (employeeWithCurrent) => {
            const details = await this.employeeService.getEmployeeDetails(employeeWithCurrent.employeeId);
            return {
              employeeId: employeeWithCurrent.employeeId,
              employeeFullName: details.employeeFullName,
              avatarUrl: details.photoUrl,
              position: details.assignment.positionTitle,
              assignment: details.assignment.name,
            };
          })
        );
        return { ...rest, employeeDetails };
      })
    );
    return overtimesWithEmployees;
  }

  async immediateSupervisorCancelOvertimeApplication(id: string) {
    const updateOvertimeApplicationResult = await this.overtimeApplicationService
      .crud()
      .update({ dto: { status: OvertimeStatus.CANCELLED }, updateBy: { id }, onError: () => new InternalServerErrorException() });
    if (updateOvertimeApplicationResult.affected > 0) {
      const updateOvertimeApprovalResult = await this.overtimeApprovalService.crud().update({
        dto: { dateApproved: dayjs().toDate() },
        updateBy: { overtimeApplicationId: { id } },
        onError: () => new InternalServerErrorException(),
      });
      if (updateOvertimeApprovalResult.affected > 0) return { cancelledOvertimeApplication: id };
    }
    return;
  }

  private getComputedHours(hours: number) {
    let deduction = 0;
    for (let i = 4; i <= hours; i++) {
      if (i % 5 === 0) deduction += 1;
    }
    return hours - deduction;
  }
}
