import { MicroserviceClient } from '@gscwd-api/microservices';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

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
}
