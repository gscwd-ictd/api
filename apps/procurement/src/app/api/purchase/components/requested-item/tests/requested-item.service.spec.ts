import { Test, TestingModule } from '@nestjs/testing';
import { RequestedItemService } from '../core/requested-item.service';

describe('RequestedItemService', () => {
  let service: RequestedItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestedItemService],
    }).compile();

    service = module.get<RequestedItemService>(RequestedItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
