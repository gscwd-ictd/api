import { Test, TestingModule } from '@nestjs/testing';
import { CharacteristicsService } from './characteristics.service';

describe('CharacteristicsService', () => {
  let service: CharacteristicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharacteristicsService],
    }).compile();

    service = module.get<CharacteristicsService>(CharacteristicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
