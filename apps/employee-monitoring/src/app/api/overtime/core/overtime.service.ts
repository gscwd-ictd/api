import {
  CreateOvertimeDto,
  OvertimeAccomplishment,
  OvertimeApplication,
  OvertimeEmployee,
  OvertimeImmediateSupervisor,
  UpdateOvertimeAccomplishmentByEmployeeDto,
  UpdateOvertimeAccomplishmentDto,
  UpdateOvertimeApprovalDto,
} from '@gscwd-api/models';
import { OvertimeStatus, OvertimeSummaryHalf, ScheduleBase } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import dayjs = require('dayjs');
import { DataSource, EntityManager, EntityMetadata, TreeLevelColumn } from 'typeorm';
import { EmployeeScheduleService } from '../../daily-time-record/components/employee-schedule/core/employee-schedule.service';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { EmployeesService } from '../../employees/core/employees.service';
import { OvertimeAccomplishmentService } from '../components/overtime-accomplishment/core/overtime-accomplishment.service';
import { OvertimeApplicationService } from '../components/overtime-application/core/overtime-application.service';
import { OvertimeApprovalService } from '../components/overtime-approval/core/overtime-approval.service';
import { OvertimeEmployeeService } from '../components/overtime-employee/core/overtime-employee.service';
import { OvertimeImmediateSupervisorService } from '../components/overtime-immediate-supervisor/core/overtime-immediate-supervisor.service';
import { getDayRange1stHalf, getDayRange2ndHalf } from '@gscwd-api/utils';

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
      try {
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

        const { isAccomplishmentSubmitted, status } = (
          await this.employeeScheduleService.rawQuery(
            `
            SELECT IF(accomplishments IS NOT NULL,true,false) isAccomplishmentSubmitted, oa.status status 
              FROM overtime_accomplishment oa 
              INNER JOIN overtime_employee oe ON oe.overtime_employee_id = oa.overtime_employee_id_fk 
            WHERE oe.employee_id_fk = ? AND oe.overtime_application_id_fk = ?;`,
            [employeeId, overtimeApplication.overtimeApplicationId]
          )
        )[0];

        return {
          employeeId,
          companyId,
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
  }

  async getOvertimeApplicationsForApprovalV2(managerId: string) {
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
    const overtimeApplications = await this.overtimeApplicationService.getOvertimeApplicationsByEmployeeIds(employeeIds);

    const overtimeApplicationsWithSupervisorName = await Promise.all(
      overtimeApplications.map(async (overtimeApplication) => {
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

            const { isAccomplishmentSubmitted, status } = (
              await this.employeeScheduleService.rawQuery(
                `
            SELECT IF(accomplishments IS NOT NULL,true,false) isAccomplishmentSubmitted, oa.status status 
              FROM overtime_accomplishment oa 
              INNER JOIN overtime_employee oe ON oe.overtime_employee_id = oa.overtime_employee_id_fk 
            WHERE oe.employee_id_fk = ? AND oe.overtime_application_id_fk = ?;`,
                [employeeId, overtimeApplication.overtimeApplicationId]
              )
            )[0];

            return {
              employeeId,
              companyId,
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
        entryDate: dayjs(rest.overtimeEmployeeId.overtimeApplicationId.plannedDate).toDate(),
      });

      if (didFaceScan) {
        await this.updateOvertimeAccomplishment({
          employeeId,
          overtimeApplicationId: { id, ...restOfOvertimeApplication },
          ivmsTimeIn: dtr.dtr.timeIn,
          ivmsTimeOut: dtr.dtr.timeOut,
        });
      }
    }

    const updatedOvertimeDetails = (await this.overtimeAccomplishmentService.crud().findOne({
      find: {
        select: {
          id: true,
          ivmsTimeIn: true,
          ivmsTimeOut: true,
          encodedTimeIn: true,
          encodedTimeOut: true,
          accomplishments: true,
          followEstimatedHrs: true,
          status: true,
          remarks: true,
          overtimeEmployeeId: { id: true, overtimeApplicationId: { estimatedHours: true, plannedDate: true } },
        },
        where: { overtimeEmployeeId: { employeeId, overtimeApplicationId: { id: overtimeApplicationId } } },
        relations: { overtimeEmployeeId: { overtimeApplicationId: true } },
      },
    })) as OvertimeAccomplishment;
    const { overtimeEmployeeId, ...restOfUpdatedOvertime } = updatedOvertimeDetails;
    const estimatedHours = overtimeEmployeeId.overtimeApplicationId.estimatedHours;

    let computedIvmsHours = null;
    let computedEncodedHours = null;
    const plannedDate = updatedOvertimeDetails.overtimeEmployeeId.overtimeApplicationId.plannedDate;
    //check if not restday

    if (didFaceScan) {
      if (dayjs(plannedDate).day() in restDays) {
        let _timeIn = dtr.schedule.timeIn;
        if (
          dayjs(plannedDate + ' ' + updatedOvertimeDetails.ivmsTimeIn).isAfter(dayjs(plannedDate + ' ' + dtr.schedule.timeIn)) ||
          dayjs(plannedDate + ' ' + updatedOvertimeDetails.ivmsTimeIn).isSame(dayjs(plannedDate + ' ' + dtr.schedule.timeIn))
        ) {
          _timeIn = updatedOvertimeDetails.ivmsTimeIn;
        }
        computedIvmsHours = dayjs(plannedDate + ' ' + updatedOvertimeDetails.ivmsTimeOut).diff(dayjs(plannedDate + ' ' + _timeIn), 'hour');
      } else {
        //get overtime after schedule
        computedIvmsHours = dayjs(plannedDate + ' ' + updatedOvertimeDetails.ivmsTimeOut).diff(
          dayjs(plannedDate + ' ' + dtr.schedule.timeOut),
          'hour'
        );
      }
      if (computedIvmsHours >= 4) {
        //computedIvmsHours = dtr.schedule.lunchOut !== null;
        //console.log(computedEncodedHours);
        computedEncodedHours =
          dtr.schedule.lunchOut !== null
            ? computedIvmsHours - (computedIvmsHours - parseInt((computedIvmsHours / 4).toString()) * 4)
            : computedIvmsHours - (computedIvmsHours - parseInt((computedIvmsHours / 4).toString()) * 4);
      }
    }

    if (updatedOvertimeDetails.encodedTimeIn !== null && updatedOvertimeDetails.encodedTimeOut !== null) {
      if (dayjs(plannedDate).day() in restDays) {
        computedEncodedHours = dayjs(plannedDate + ' ' + updatedOvertimeDetails.encodedTimeOut).diff(
          dayjs(plannedDate + ' ' + updatedOvertimeDetails.encodedTimeIn),
          'hour'
        );
      } else {
        //get overtime after schedule
        computedEncodedHours = dayjs(plannedDate + ' ' + updatedOvertimeDetails.encodedTimeOut).diff(
          dayjs(plannedDate + ' ' + updatedOvertimeDetails.encodedTimeIn),
          'hour'
        );
      }
      if (computedEncodedHours > 4) {
        console.log(computedEncodedHours);
        computedEncodedHours =
          dtr.schedule.lunchOut !== null
            ? computedEncodedHours - (computedEncodedHours - parseInt((computedEncodedHours / 4).toString()) * 4)
            : computedEncodedHours - (computedEncodedHours - parseInt((computedEncodedHours / 4).toString()) * 4);
      }
    }

    return {
      ...restOfUpdatedOvertime,
      ...supervisorEmployeeSignatures,
      plannedDate,
      computedIvmsHours: computedIvmsHours > 0 ? computedIvmsHours : 0,
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
      dto: overtimeAccomplishmentDto,
      updateBy: {
        id: id.id,
      },
    });

    if (result.affected > 0) return updateOvertimeAccomplishmentDto;
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
    const pendingOvertimes = (await this.overtimeAccomplishmentService.crud().findAll({
      find: {
        select: {
          overtimeEmployeeId: {
            id: true,
            employeeId: true,
            overtimeApplicationId: { id: true, status: true, purpose: true, plannedDate: true },
          },
          remarks: true,
          status: true,
          followEstimatedHrs: true,
          accomplishments: true,
          id: true,
        },
        where: {
          overtimeEmployeeId: { employeeId, overtimeApplicationId: { status: OvertimeStatus.APPROVED } },
          status: OvertimeStatus.PENDING,
        },
        relations: { overtimeEmployeeId: { overtimeApplicationId: true } },
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

        const overtimeAccomplishmentDetails = await this.getOvertimeDetails(employeeId, overtimeApplicationId.id);

        return {
          ...overtimeAccomplishmentDetails,
          overtimeApplicationId: overtimeApplicationId.id,
          estimatedHours,
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
            overtimeApplicationId: { id: true, status: true, purpose: true, plannedDate: true },
          },
          remarks: true,
          status: true,
          followEstimatedHrs: true,
          accomplishments: true,
          id: true,
        },
        where: {
          overtimeEmployeeId: { employeeId, overtimeApplicationId: { status: OvertimeStatus.APPROVED } },
          status: OvertimeStatus.APPROVED,
        },
        relations: { overtimeEmployeeId: { overtimeApplicationId: true } },
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

        return {
          ...overtimeAccomplishmentDetails,
          overtimeApplicationId: overtimeApplicationId.id,
          estimatedHours,
          plannedDate,
          employeeId,
          purpose,
          remarks,
          status,
        };
      })
    );

    return { forApproval: pendingResult, completed: approvedResult };
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

  async getOvertimeAccomplishmentsByOvertimeApplicationId(overtimeApplicationId: string) {
    console.log(overtimeApplicationId);
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
        INNER JOIN overtime_immediate_supervisor ois ON ois.overtime_immediate_supervisor_id = oa.overtime_immediate_supervisor_id_fk 
        INNER JOIN overtime_approval oappr ON oappr.overtime_application_id_fk = oa.overtime_application_id 
        WHERE  oa.overtime_application_id = ? AND ois.employee_id_fk = ? 
    `,
        [overtimeApplicationId, immediateSupervisorEmployeeId]
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

    //const overtimeApproval = await this.overtimeApprovalService.rawQuery(``, []);
    const managerId = (await this.employeeService.getEmployeeSupervisorId(immediateSupervisorEmployeeId)).toString();
    const supervisorAndManagerNames = await this.employeeService.getEmployeeAndSupervisorName(immediateSupervisorEmployeeId, managerId);

    console.log('🍆 🍆 🍆 🍆 🍆', overtimeApplication, employees, supervisorAndManagerNames);

    return { ...overtimeApplication, employees, signatories: { ...supervisorAndManagerNames } };
  }

  async getOvertimeSummary(immediateSupervisorEmployeeId: string, year: number, month: number, half: OvertimeSummaryHalf) {
    //
    const numOfDays = dayjs(year + '-' + month + '-1').daysInMonth();
    console.log(numOfDays);
    const days =
      half === OvertimeSummaryHalf.FIRST_HALF ? getDayRange1stHalf() : half === OvertimeSummaryHalf.SECOND_HALF ? getDayRange2ndHalf(numOfDays) : [];
    const employees = (await this.overtimeApplicationService.rawQuery(
      `
      SELECT DISTINCT oe.employee_id_fk employeeId FROM overtime_employee oe 
        INNER JOIN overtime_application oa ON oa.overtime_application_id = oe.overtime_application_id_fk 
        INNER JOIN overtime_immediate_supervisor ois ON ois.overtime_immediate_supervisor_id = oa.overtime_immediate_supervisor_id_fk 
      WHERE date_format(planned_date,'%Y')=? AND date_format(planned_date,'%m') = ? AND  date_format(planned_date,'%d') IN (?) AND ois.employee_id_fk = ?
    ;`,
      [year, month, days, immediateSupervisorEmployeeId]
    )) as { employeeId: string }[];

    const employeeDetails = await Promise.all(
      employees.map(async (employee) => {
        const details = await this.employeeService.getEmployeeDetails(employee.employeeId);
        const overtimes = await Promise.all(
          days.map(async (day) => {
            //!TODO get every overtime of the employee on specific year and month on specified days in the half chosen
            //const overtime = await this.overtimeApplicationService.rawQuery(`SELECT * FROM overtime_application oa INNER JOIN `,);
          })
        );
        return details.employeeFullName;
      })
    );
    console.log(employeeDetails);
  }
  //#endregion Reports
}
