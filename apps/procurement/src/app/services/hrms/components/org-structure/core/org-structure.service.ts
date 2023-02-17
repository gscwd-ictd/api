import { MicroserviceClient, OrganizationalStructurePatterns } from '@gscwd-api/microservices';
import { OrganizationalStructure, OrganizationEntity } from '@gscwd-api/utils';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class OrgStructureService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async getOrganizationalStructure() {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: OrganizationalStructurePatterns.GET_ORG,
      payload: {},
    })) as OrganizationalStructure;
  }

  async getOrgUnitById(id: string): Promise<OrganizationEntity> {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: OrganizationalStructurePatterns.GET_ORG_BY_ID,
      payload: id,
      onError: ({ message, code }) =>
        new HttpException({ message: `Failed to find org with id: ${id}`, error: message }, code, { cause: new Error() }),
    })) as OrganizationEntity;
  }
}
