import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateVenueFacilityDto, VenueFacility } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class VenueFacilitiesService extends CrudHelper<VenueFacility> {
  constructor(private readonly crudService: CrudService<VenueFacility>) {
    super(crudService);
  }

  async addVenueFacilities(venueFacilitydto: CreateVenueFacilityDto, entityManager: EntityManager) {
    const venueFacility = await this.crudService.transact<VenueFacility>(entityManager).create({
      dto: venueFacilitydto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { venueDetails, ...rest } = venueFacility;
    return rest;
  }
}
