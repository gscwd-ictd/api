import { Test, TestingModule } from '@nestjs/testing';
import { RequestedItemsService } from '../core/requested-items.service';

describe('RequestedItemsService', () => {
  let service: RequestedItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestedItemsService],
    }).compile();

    service = module.get<RequestedItemsService>(RequestedItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
