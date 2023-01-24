import { Test, TestingModule } from '@nestjs/testing';
import { ItemPpeService } from './item-ppe.service';

describe('ItemPpeService', () => {
  let service: ItemPpeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemPpeService],
    }).compile();

    service = module.get<ItemPpeService>(ItemPpeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
