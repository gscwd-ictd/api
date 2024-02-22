import { MicroserviceClient } from '@gscwd-api/microservices';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class OrganizationService {
  constructor(private readonly client: MicroserviceClient) {}

  async getAllAvailableOrgStructs(orgIds: string[]) {
    return (await this.client.call({
      action: 'send',
      payload: orgIds,
      pattern: 'get_available_org_structs',
      onError: (error) => new NotFoundException(error),
    })) as { label: string; value: string }[];
  }

  async getOrgNameByOrgId(orgId: string) {
    return (await this.client.call({
      action: 'send',
      payload: orgId,
      pattern: 'get_org_name_by_org_id',
      onError: (error) => new NotFoundException(error),
    })) as string;
  }
}
