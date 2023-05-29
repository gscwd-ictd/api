import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateVenueDetailsDto, VenueDetails, VenueFacility } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { VenueFacilitiesService } from '../components/venue-facilities';

@Injectable()
export class VenueDetailsService extends CrudHelper<VenueDetails> {
  constructor(
    private readonly crudService: CrudService<VenueDetails>,
    private readonly datasource: DataSource,
    private readonly venueFacilitiesService: VenueFacilitiesService
  ) {
    super(crudService);
  }

  async addVenueDetails(venueDetailsDto: CreateVenueDetailsDto) {
    const venueDetails = await this.datasource.transaction(async (entityManager) => {
      const { venueFacility, ...rest } = venueDetailsDto;

      const newVenueDetails = await this.crudService.transact<VenueDetails>(entityManager).create({
        dto: rest,
        onError: ({ error }) => {
          return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
        },
      });

      const newVenueFacility = await Promise.all(
        venueFacility.map(async (venueFacilityItem) => {
          return await this.venueFacilitiesService.addVenueFacilities(
            {
              venueDetails: newVenueDetails,
              ...venueFacilityItem,
            },
            entityManager
          );
        })
      );

      return {
        venueDetails: { ...newVenueDetails, venueFacility: newVenueFacility },
      };
    });
    return venueDetails;
  }
}
