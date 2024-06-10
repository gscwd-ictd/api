import { MicroserviceClient } from '@gscwd-api/microservices';
import { EmployeeDetails } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { stringify } from 'querystring';

@Injectable()
export class EmployeesService {
  constructor(private readonly client: MicroserviceClient) {}

  async getAllPermanentEmployeeIds() {
    //get_all_regular_employee_ids
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
    //get_employee_under_supervisor
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
    //find_employee_details
    const employeeDetails = (await this.client.call({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_details',
      onError: (error) => {
        console.log('asdzxc', error);
        throw new NotFoundException(error);
      },
    })) as EmployeeDetails;

    return employeeDetails;
  }

  async getEmployeeDetailsWithSignature(employeeId: string) {
    //find_employee_details
    const employeeDetails = (await this.client.call({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_details_with_signature',
      onError: (error) => new NotFoundException(error),
    })) as EmployeeDetails;

    return employeeDetails;
  }

  // async getEmployeesUnderOrganizationId(orgId: string){

  // }

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

  //get_monthly_hourly_rate_by_employee_id
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

  async getEmployeesByOrgIdAlone(orgId: string) {
    //get_employees_by_org_id_alone
    return (await this.client.call<string, string, { value: string; label: string }[]>({
      action: 'send',
      payload: orgId,
      pattern: 'get_employees_by_org_id_alone',
    })) as { value: string; label: string }[];
  }

  async getAllPermanentCasualEmployees() {
    //get_all_permanent_casual_employees
    return (await this.client.call<string, object, { value: string; label: string }[]>({
      action: 'send',
      payload: {},
      pattern: 'get_all_permanent_casual_employees',
    })) as { value: string; label: string }[];
  }

  async getAllPermanentCasualEmployees2() {
    //get_all_permanent_casual_employees
    return (await this.client.call<string, object, { value: string; label: string }[]>({
      action: 'send',
      payload: {},
      pattern: 'get_all_permanent_casual_employees2',
    })) as { value: string; label: string }[];
  }

  async getCompanyId(employeeId: string) {
    //get_company_id_by_employee_id
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

  //get_salary_grade_or_daily_rate_by_employee_id
  async getSalaryGradeOrDailyRateByEmployeeId(employeeId) {
    return (await this.client.call<string, string, object>({
      action: 'send',
      pattern: 'get_salary_grade_or_daily_rate_by_employee_id',
      payload: employeeId,
    })) as { salaryGradeAmount: number; amount: number; dailyRate: number };
  }
}
