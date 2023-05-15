import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { TravelOrderItinerary, TravelOrderItineraryDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class TravelOrderItineraryService extends CrudHelper<TravelOrderItinerary> {
  constructor(private readonly crudService: CrudService<TravelOrderItinerary>, private dataSource: DataSource) {
    super(crudService);
  }

  async addTravelOrderItineraryTransaction(travelOrderItineraryDto: TravelOrderItineraryDto, entityManager: EntityManager) {
    return await this.crudService.transact<TravelOrderItinerary>(entityManager).create({
      dto: travelOrderItineraryDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async deleteAllTravelOrderItineraryByTravelOrderIdTransaction(travelOrderId: string, entityManager: EntityManager) {
    const deleteResult = await this.crudService.transact(entityManager).delete({
      deleteBy: { travelOrderId },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return deleteResult;
  }
}
