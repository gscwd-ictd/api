import { GetEmployeesNameByIdPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class EmployeesService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async findEmployeesNameById(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: GetEmployeesNameByIdPatterns.FIND_EMPLOYEES_NAME_BY_ID,
      payload: id,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  //   async findItemFromViewById(id: string): Promise<ItemDetailsFromView> {
  //     return (await this.microserviceClient.call({
  //       action: 'send',
  //       pattern: ItemsViewPatterns.FIND_BY_ID,
  //       payload: { id },
  //       onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
  //     })) as ItemDetailsFromView;
  //   }
}
