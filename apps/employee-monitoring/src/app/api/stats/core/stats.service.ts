import { LeaveApplicationStatus, OvertimeStatus, PassSlipApprovalStatus } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../employees/core/employees.service';
import { PassSlipService } from '../../pass-slip/core/pass-slip.service';
import { OrganizationService } from '../../organization/core/organization.service';
import dayjs = require('dayjs');

@Injectable()
export class StatsService {
  constructor(
    private readonly passSlipService: PassSlipService,
    private readonly employeeService: EmployeesService,
    private readonly organizationService: OrganizationService
  ) {}

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
          WHERE supervisor_id_fk = ? AND (status = ? OR status = ?) 
    `,
          [employeeId, PassSlipApprovalStatus.FOR_SUPERVISOR_APPROVAL, PassSlipApprovalStatus.FOR_DISPUTE]
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

  async getLatesPerDepartment() {
    try {
      const depts = (await this.organizationService.getAllDepartmentsAndOgm()).map((dept) => ({ _id: dept._id, code: dept.code }));
      //get company_ids per department;
      console.log(depts);
      //return depts
      const result = await Promise.all(
        depts.map(async (dep) => {
          const { _id, code } = dep;
          let lates = 0;
          const companyIds = await this.employeeService.getCompanyIdsByOrgId(_id);

          const latesCountPerDepartment = await Promise.all(
            companyIds.map(async (_companyId) => {
              const { companyId } = _companyId;
              const dateFrom = dayjs(dayjs().year() + '-' + (dayjs().month() + 1).toString() + '-' + '1').toDate();
              const dateTo = dayjs().toDate();
              const reportOnAttendance = (
                await this.passSlipService.rawQuery(`CALL sp_generate_report_on_attendance(?,?,?);`, [
                  companyId,
                  dayjs(dateFrom).format('YYYY-MM-DD'),
                  dayjs(dateTo).format('YYYY-MM-DD'),
                ])
              )[0][0] as {
                numberOfTimesLate: number;
              };
              lates += typeof reportOnAttendance === 'undefined' ? 0 : reportOnAttendance.numberOfTimesLate;
            })
          );
          return { code, lates };
        })
      );
      const labels = result.map((res) => res.code);
      const data = result.map((res) => res.lates);
      return {
        labels,
        data,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
