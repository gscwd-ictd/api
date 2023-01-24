import { Test, TestingModule } from '@nestjs/testing';
import { PpeCategoriesService } from '../core/categories.service';

describe('CategoriesService', () => {
  let service: PpeCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PpeCategoriesService],
    }).compile();

    service = module.get<PpeCategoriesService>(PpeCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
