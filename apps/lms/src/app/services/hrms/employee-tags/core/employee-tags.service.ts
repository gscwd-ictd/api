import { EmployeeTagsPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { CreateEmployeeTagDto, DeleteEmployeeTagDto } from '@gscwd-api/models';
import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { TagsService } from '../../../../api/tags';

@Injectable()
export class HrmsEmployeeTagsService {
  constructor(
    private readonly microserviceClient: MicroserviceClient,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService
  ) {}

  /* create multiple employee tags in a multiple employees */
  async createEmployeeTags(data: CreateEmployeeTagDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.ADD_EMPLOYEE_TAGS,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  /* find employee tags by employee id */
  async findTagsByEmployeeId(employeeId: string) {
    const tagIds = (await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.GET_TAGS_BY_EMPLOYEE_ID,
      payload: employeeId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as Array<string>;

    return await Promise.all(tagIds.map(async (tagId) => await this.tagsService.crud().findOneBy({ findBy: { id: tagId } })));
  }

  /* find employee tags by tag id */
  async findEmployeesByTagId(tagId: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.GET_EMPLOYEES_BY_TAG_ID,
      payload: tagId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  /* find employees names by multiple tag id */
  async findEmployeesByMultipleTagId(tags: Array<string>) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.GET_EMPLOYEES_BY_TAGS_IDS,
      payload: tags,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  /* remove employee tags by employee id or tag id */
  async deleteEmployeeTags(dto: DeleteEmployeeTagDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.DELETE_EMPLOYEE_TAGS,
      payload: dto,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  /* count employee tags by tag id */
  async countEmployeeTags(tagId: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: EmployeeTagsPatterns.COUNT_EMPLOYEE_TAGS,
      payload: tagId,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async checkEmployeeTags(employeeId: string, tagsId: Array<string>) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: 'check_employee_tags',
      payload: { employeeId, tagsId },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
