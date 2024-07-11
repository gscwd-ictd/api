import { FindEmployeesPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import {
  BenchmarkParticipantsRaw,
  EmployeeDetailsRaw,
  EmployeeFullNameRaw,
  EmployeeListsRaw,
  OrganizationEmployeeRaw,
  OrganizationRaw,
  SupervisorRaw,
} from '@gscwd-api/utils';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class HrmsEmployeesService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  /* find all employees by name match */
  async findEmployeesByName(name: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEES_BY_NAME_MATCH,
      payload: name,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  /* find employees name by id */
  async findEmployeesById(id: string) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEES_BY_ID,
      payload: id,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as EmployeeFullNameRaw;
  }

  /* find all organization  */
  async findAllOrganization() {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_ALL_ORGANIZATION,
      payload: '',
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as Array<OrganizationRaw>;
  }

  /* find all employees by organization  */
  async findAllEmployeesByOrganizationId(organizationId: string) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEES_BY_ORGANIZATION_ID,
      payload: organizationId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as Array<OrganizationEmployeeRaw>;
  }

  /* find all employees with supervisor */
  async findAllEmployeesWithSupervisor() {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_ALL_EMPLOYEES_WITH_SUPERVISOR,
      payload: '',
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as Array<BenchmarkParticipantsRaw>;
  }

  /* find employees with supervisor by employee id */
  async findEmployeesWithSupervisorByEmployeeId(employeeId: string) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEE_WITH_SUPERVISOR,
      payload: employeeId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as BenchmarkParticipantsRaw;
  }

  /* find all supervisors */
  async findAllSupervisors() {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_ALL_MANAGERS_FOR_LND,
      payload: '',
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as Array<SupervisorRaw>;
  }

  async findAllEmployeeUnderSupervisor(supervisorId: string) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEES_UNDER_MANAGER,
      payload: supervisorId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as Array<EmployeeListsRaw>;
  }

  /* find employee details by employee id */
  async findEmployeeDetailsByEmployeeId(employeeId: string) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: FindEmployeesPatterns.GET_EMPLOYEE_DETAILS,
      payload: employeeId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as EmployeeDetailsRaw;
  }
}
