import { GetAllManagersPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';
import { EmployeesService } from '../../employees';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class ManagersService {
  constructor(private readonly microserviceClient: MicroserviceClient, private readonly employeesService: EmployeesService) {}

  // async findAllManagersFromView(id: string) {
  //   return await this.employeesService.findEmployeesNameById(id);
  // }

  async findAllManagers({ page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: GetAllManagersPatterns.FIND_ALL_MANAGERS,
      payload: { page, limit },
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
