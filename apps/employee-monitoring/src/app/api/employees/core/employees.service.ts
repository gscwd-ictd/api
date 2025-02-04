import { MicroserviceClient } from '@gscwd-api/microservices';
import { EmployeeDetails, NatureOfAppointment } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(private readonly client: MicroserviceClient, private readonly dataSource: DataSource) { }

  async getAllPermanentEmployeeIds() {
    const employees = (await this.client.call<string, object, []>({
      action: 'send',
      pattern: 'get_all_regular_employee_ids',
      payload: {},
      onError: (error) => {
        throw new InternalServerErrorException();
      },
    })) as { employeeId: string; companyId: string }[];

    return employees;
  }

  async getBasicEmployeeDetailsByEmployeeId(employeeId: string): Promise<EmployeeDetails & { employeeFullNameFirst: string, orgStruct: { officeName: string, divisionName: string, departmentName: string } }> {
    try {
      const employeeDetails = await this.dataSource.query(`
          SELECT emp._id userId, 
                emp.company_id companyId,
                ${process.env.HRMS_DB_NAME}get_employee_position_or_oic(emp._id) positionTitle, 
                ${process.env.HRMS_DB_NAME}get_employee_position_id_or_oic(emp._id) positionId,
                ${process.env.HRMS_DB_NAME}is_hrm_psb(emp._id) isHRMPSB,
                ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) employeeFullName,
                ${process.env.HRMS_DB_NAME}get_employee_fullname(emp._id) employeeFullNameFirst,
                ${process.env.HRMS_DB_NAME}get_user_role(emp._id) userRole,
                port_emp.photo_url photoUrl
          FROM ${process.env.HRMS_DB_NAME}employees emp 
          INNER JOIN ${process.env.HRMS_DB_NAME}plantilla_positions pp ON pp.employee_id_fk = emp._id
          INNER JOIN ${process.env.PORTAL_DB_NAME}employees port_emp ON port_emp.user_id_fk = emp._id
          WHERE emp._id = ?;
        `, [employeeId]);

      const { id, name, userId, employeeFullName, companyId, positionId, positionTitle, userRole, employeeFullNameFirst, photoUrl } = employeeDetails[0];
      const { officeName, divisionName, departmentName } = (await this.dataSource.query(`CALL ${process.env.HRMS_DB_NAME}sp_get_office_department_division(?);`, [id]))[0][0];


      return {
        userId,
        companyId,
        employeeFullName,
        employeeFullNameFirst,
        photoUrl,
        assignment: { id, name, positionId, positionTitle },
        orgStruct: { officeName, divisionName, departmentName },
        userRole,
      } as EmployeeDetails & { employeeFullNameFirst: string, orgStruct: { officeName: string, divisionName: string, departmentName: string } };
    }
    catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getEmployeeDetailsByCompanyId(companyId: string) {
    const employeeDetails = (await this.client.call({
      action: 'send',
      payload: companyId,
      pattern: 'get_employee_details_by_company_id',
      onError: (error) => new NotFoundException(error),
    })) as EmployeeDetails;

    return employeeDetails;
  }

  async getEmployeesUnderSupervisor(employeeId: string) {
    const employees = (await this.client.call<string, string, object>({
      action: 'send',
      payload: employeeId,
      pattern: 'get_subordinates_with_company_id',
      onError: (error) => new NotFoundException(error),
    })) as {
      companyId: string;
      fullName: string;
      employeeId: string;
    }[];
    return employees;
  }

  async getImmediateEmployeesUnderSupervisor(employeeId: string) {
    const employees = (await this.client.call<string, string, object>({
      action: 'send',
      payload: employeeId,
      pattern: 'get_subordinates_with_company_id',
      onError: (error) => new NotFoundException(error),
    })) as {
      companyId: string;
      fullName: string;
      employeeId: string;
    }[];

    return employees;
  }

  async getEmployeeAssignment(employeeId: string) {
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

  async getEmployeeDetails(employeeId: string) {
    const employeeDetails = (await this.client.call({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_details',
      onError: (error) => {
        console.log('getEmployeeDetails Function Employee ID Error', employeeId);
        throw new NotFoundException(error);
      },
    })) as EmployeeDetails;
    return employeeDetails;
  }

  async getBasicEmployeeDetails(employeeId: string) {
    const employeeDetails = (await this.client.call({
      action: 'send',
      payload: employeeId,
      pattern: 'get_basic_employee_details',
      onError: (error) => {
        console.log('getBasicEmployeeDetails Employee ID Error', employeeId);
        throw new NotFoundException(error);
      },
    })) as EmployeeDetails;
    return employeeDetails;
  }

  async getBasicEmployeeDetailsWithSignature(employeeId: string) {
    //find_employee_details
    const employeeDetails = (await this.client.call({
      action: 'send',
      payload: employeeId,
      pattern: 'get_basic_employee_details_with_signature',
      onError: (error) => {
        console.log('getBasicEmployeeDetailsWithSignature Employee ID Error', employeeId);
        throw new NotFoundException(error);
      },
    })) as EmployeeDetails;
    return employeeDetails;
  }

  async getEmployeeDetailsWithSignature(employeeId: string) {
    const employeeDetails = (await this.client.call({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_details_with_signature',
      onError: (error) => new NotFoundException(error),
    })) as EmployeeDetails;

    return employeeDetails;
  }

  async getEmployeeAndSupervisorName(employeeId: string, supervisorId: string) {
    return (await this.client.call<string, { employeeId: string; supervisorId: string }, { employeeName: string; supervisorName: string }>({
      action: 'send',
      payload: { employeeId, supervisorId },
      pattern: 'get_employee_supervisor_names',
      onError: (error) => new NotFoundException(error),
    })) as { employeeName: string; supervisorName: string; employeeSignature: string; supervisorSignature: string };
  }

  async getEmployeeSupervisorId(employeeId: string) {
    return (await this.client.call<string, string, string>({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_supervisor_id',
      onError: (error) => new NotFoundException(error),
    })) as string;
  }

  async getMonthlyHourlyRateByEmployeeId(employeeId: string) {
    return await this.client.call<string, string, { monthlyRate: number; hourlyRate: number }>({
      action: 'send',
      payload: employeeId,
      pattern: 'get_monthly_hourly_rate_by_employee_id',
      onError: (error) => new NotFoundException(error),
    });
  }

  async getEmployeeNatureOfAppointment(employeeId: string) {
    return await this.client.call<string, string, string>({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_nature_of_appointment',
      onError: (error) => new NotFoundException(error),
    });
  }

  async getEmployeeName(employeeId: string) {
    return (
      (await this.client.call<{ msg: string }, string, { fullName: string }>({
        action: 'send',
        payload: employeeId,
        pattern: { msg: 'get_employee_name' },
        onError: (error) => new NotFoundException(error),
      })) as { fullName: string }
    ).fullName;
  }

  async getEmployeesByOrgId(orgId: string) {
    return (await this.client.call<string, string, { value: string; label: string }[]>({
      action: 'send',
      payload: orgId,
      pattern: 'get_employees_by_org_id',
    })) as { value: string; label: string }[];
  }

  async getEmployeesByOrgIdForOt(orgId: string) {
    return (await this.client.call<string, string, { value: string; label: string }[]>({
      action: 'send',
      payload: orgId,
      pattern: 'get_employees_by_org_id_for_ot',
    })) as { value: string; label: string }[];
  }

  async getEmployeesByOrgIdAlone(orgId: string) {
    return (await this.client.call<string, string, { value: string; label: string }[]>({
      action: 'send',
      payload: orgId,
      pattern: 'get_employees_by_org_id_alone',
    })) as { value: string; label: string }[];
  }

  async getAllPermanentCasualEmployees() {
    return (await this.client.call<string, object, { value: string; label: string }[]>({
      action: 'send',
      payload: {},
      pattern: 'get_all_permanent_casual_employees',
    })) as { value: string; label: string }[];
  }

  async getAllPermanentCasualEmployees2() {
    return (await this.client.call<string, object, { value: string; label: string }[]>({
      action: 'send',
      payload: {},
      pattern: 'get_all_permanent_casual_employees2',
    })) as { value: string; label: string }[];
  }

  async getCompanyId(employeeId: string) {
    return (
      (await this.client.call<string, string, { companyId: string }>({
        action: 'send',
        payload: employeeId,
        pattern: 'get_company_id_by_employee_id',
        onError: (error) => new NotFoundException(error),
      })) as { companyId: string }
    ).companyId;
  }

  async getAllAssignablePermanentCasualEmployees(employeeIds: string[]) {
    return (await this.client.call<string, string[], object[]>({
      action: 'send',
      pattern: 'get_all_assignable_permanent_casual_employees',
      payload: employeeIds,
    })) as { label: string; value: string }[];
  }

  async getCompanyIdsByOrgId(orgId: string) {
    return (await this.client.call<string, string, object[]>({
      action: 'send',
      pattern: 'get_company_ids_by_org_id',
      payload: orgId,
    })) as { companyId: string }[];
  }

  async getSupervisoryEmployeesForDropdown(employeeId: string) {
    return (await this.client.call<string, string, object[]>({
      action: 'send',
      pattern: 'get_all_assignable_supervisory_employees_by_id',
      payload: employeeId,
    })) as { label: string; value: string }[];
  }

  async getSalaryGradeOrDailyRateByEmployeeId(employeeId: string) {
    return (await this.client.call<string, string, object>({
      action: 'send',
      pattern: 'get_salary_grade_or_daily_rate_by_employee_id',
      payload: employeeId,
    })) as { salaryGradeAmount: number; amount: number; dailyRate: number };
  }

  async getHrdManagerId() {
    return (await this.client.call<string, object, string>({
      action: 'send',
      pattern: 'get_hrd_manager',
      payload: {},
    })) as string;
  }

  async getEmployeesByNatureOfAppointmentAndEmployeeIds(natureOfAppointment: NatureOfAppointment, employeeIds: string[]) {
    return (await this.client.call<string, object, { employeeId: string; fullName: string }[]>({
      action: 'send',
      pattern: 'get_employees_by_nature_of_appointment_and_employee_ids',
      payload: { natureOfAppointment, employeeIds },
    })) as { employeeId: string; fullName: string }[];
  }

  async getEmployeesByNatureOfAppointment(natureOfAppointment: NatureOfAppointment) {
    return (await this.client.call<string, string, { employeeId: string; fullName: string }[]>({
      action: 'send',
      pattern: 'get_employees_by_nature_of_appointment',
      payload: natureOfAppointment,
    })) as { employeeId: string; fullName: string }[];
  }
}
