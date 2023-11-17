import { LeaveApplicationStatus, OvertimeStatus, PassSlipApprovalStatus } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../employees/core/employees.service';
import { PassSlipService } from '../../pass-slip/core/pass-slip.service';

@Injectable()
export class StatsService {
  constructor(private readonly passSlipService: PassSlipService, private employeeService: EmployeesService) {}

  async countAllPendingApplicationsForManager(employeeId: string) {
    try {
      //1. get manager organization id
      const managerOrgId = (await this.employeeService.getEmployeeDetails(employeeId)).assignment.id;
      console.log(managerOrgId);
      //2. get employeeIds from organization id
      const employeesUnderOrgId = await this.employeeService.getEmployeesByOrgId(managerOrgId);
      console.log(employeesUnderOrgId);

      const employeeIds = await Promise.all(
        employeesUnderOrgId.map(async (employee) => {
          return employee.value;
        })
      );

      console.log(employeeIds);

      const pendingPassSlipsCount = (
        await this.passSlipService.rawQuery(
          `
          SELECT count(ps.pass_slip_id) passSlipCount
            FROM pass_slip ps INNER JOIN pass_slip_approval psa ON psa.pass_slip_id_fk = ps.pass_slip_id
          WHERE supervisor_id_fk = ? AND status = ?
    `,
          [employeeId, PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL]
        )
      )[0].passSlipCount;

      const pendingOvertimesCount = (
        await this.passSlipService.rawQuery(
          `
            SELECT count(DISTINCT oa.overtime_application_id) overtimeApplicationCount
            FROM overtime_application oa
              INNER JOIN overtime_employee oe ON oa.overtime_application_id = oe.overtime_application_id_fk
              INNER JOIN overtime_approval oapp ON oapp.overtime_application_id_fk = oa.overtime_application_id
              INNER JOIN overtime_immediate_supervisor ois ON ois.overtime_immediate_supervisor_id = oa.overtime_immediate_supervisor_id_fk
            WHERE oe.employee_id_fk IN (?) AND status = ?
      `,
          [employeeIds, OvertimeStatus.PENDING]
        )
      )[0].overtimeApplicationCount;

      const pendingLeavesCount = (
        await this.passSlipService.rawQuery(
          `
          SELECT count(leave_application_id) leaveCount FROM leave_application WHERE supervisor_id_fk = ? AND status = ?;
      `,
          [employeeId, LeaveApplicationStatus.FOR_SUPERVISOR_APPROVAL]
        )
      )[0].leaveCount;

      return { pendingPassSlipsCount, pendingLeavesCount, pendingOvertimesCount };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
