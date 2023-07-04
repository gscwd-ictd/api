import { EmployeeTagsPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { CreateEmployeeTags } from '@gscwd-api/models';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeTagsService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  //add multiple tags in a multiple employees
  async addEmployeeTags(data: CreateEmployeeTags) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.ADD_EMPLOYEE_TAGS,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  //find employee tags by employee id
  async findTagsByEmployeeId(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.GET_TAGS_BY_EMPLOYEE_ID,
      payload: id,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
