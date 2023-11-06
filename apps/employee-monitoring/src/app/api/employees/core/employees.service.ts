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
    return await this.client.call<string, string, string>({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_supervisor_id',
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
}
