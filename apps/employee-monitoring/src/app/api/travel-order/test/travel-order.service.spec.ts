import { Test, TestingModule } from '@nestjs/testing';
import { TravelOrderService } from '../core/travel-order.service';

describe('TravelOrderService', () => {
  let service: TravelOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelOrderService],
    }).compile();

    service = module.get<TravelOrderService>(TravelOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
