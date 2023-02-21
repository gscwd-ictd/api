import { MicroserviceClient, OrganizationalStructurePatterns } from '@gscwd-api/microservices';
import { OrganizationalStructure, BaseOrg, Organization } from '@gscwd-api/utils';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class OrgStructureService {
  constructor(private readonly client: MicroserviceClient) {}

  async getAllOrgsByStructure() {
    return (await this.client.call({
      action: 'send',
      pattern: OrganizationalStructurePatterns.GET_ORG,
      payload: {},
      onError: () => new InternalServerErrorException(),
    })) as OrganizationalStructure;
  }

  async getAllOrgsByGroup() {
    return (await this.client.call({
      action: 'send',
      pattern: 'get_organization_by_group',
      payload: {},
      onError: () => new InternalServerErrorException(),
    })) as Organization;
  }

  async getOrgUnitById(id: string): Promise<BaseOrg> {
    return (await this.client.call({
      action: 'send',
      pattern: OrganizationalStructurePatterns.GET_ORG_BY_ID,
      payload: id,
      onError: ({ message, code }) =>
        new HttpException({ message: `Failed to find org with id: ${id}`, error: message }, code, { cause: new Error() }),
    })) as BaseOrg;
  }
}
