import { MicroserviceClient, OrganizationalStructurePatterns } from '@gscwd-api/microservices';
import { OrganizationalStructure, OrganizationEntity } from '@gscwd-api/utils';
import { Injectable } from '@nestjs/common';

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

  async getOrgUnitById(id: string) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: OrganizationalStructurePatterns.GET_ORG_BY_ID,
      payload: id,
    })) as OrganizationEntity;
  }
}
