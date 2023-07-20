import { EmployeeTagsPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { CreateEmployeeTagDto, DeleteEmployeeTagDto } from '@gscwd-api/models';
import { HttpException, Injectable } from '@nestjs/common';
import { TagsService } from '../../../api/tags';

@Injectable()
export class EmployeeTagsService {
  constructor(private readonly microserviceClient: MicroserviceClient, private readonly tagsService: TagsService) {}

  //add multiple tags in a multiple employees
  async addEmployeeTags(data: CreateEmployeeTagDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.ADD_EMPLOYEE_TAGS,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  //find employee tags by employee id
  async findTagsByEmployeeId(id: string) {
    const tagIds = (await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.GET_TAGS_BY_EMPLOYEE_ID,
      payload: id,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as string[];

    return await Promise.all(tagIds.map(async (tagId) => await this.tagsService.crud().findOneBy({ findBy: { id: tagId } })));
  }

  //find employee names by tag id
  async findEmployeesByTagId(tagId: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.GET_EMPLOYEES_BY_TAG_ID,
      payload: tagId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  //delete employee tags by employee id and tag id
  async deleteEmployeeTags(dto: DeleteEmployeeTagDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.DELETE_EMPLOYEE_TAGS,
      payload: dto,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
