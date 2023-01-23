import { Test, TestingModule } from '@nestjs/testing';
import { ItemsPpeService } from './items-ppe.service';

describe('ItemsPpeService', () => {
  let service: ItemsPpeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsPpeService],
    }).compile();

    service = module.get<ItemsPpeService>(ItemsPpeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
