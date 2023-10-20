import { MicroserviceClient } from '@gscwd-api/microservices';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from '../data/modules.dto';

@Injectable()
export class ModulesService {
  constructor(private readonly client: MicroserviceClient) {}

  async saveModule(createModuleDto: CreateModuleDto) {
    return await this.client.call({
      action: 'send',
      payload: createModuleDto,
      pattern: 'create_module',
      onError: () => new InternalServerErrorException(),
    });
  }

  async getModules() {
    return await this.client.call({
      action: 'send',
      payload: 'ems',
      pattern: 'get_modules_by_app',
      onError: () => new NotFoundException(),
    });
  }

  async updateModule(updateModuleDto: UpdateModuleDto) {
    return await this.client.call({
      action: 'send',
      payload: updateModuleDto,
      pattern: 'update_module',
      onError: () => new InternalServerErrorException(),
    });
  }
}
