import { Test, TestingModule } from '@nestjs/testing';
import { TravelOrderItineraryService } from '../core/travel-order-itinerary.service';

describe('TravelOrderItineraryService', () => {
  let service: TravelOrderItineraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelOrderItineraryService],
    }).compile();

    service = module.get<TravelOrderItineraryService>(TravelOrderItineraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
