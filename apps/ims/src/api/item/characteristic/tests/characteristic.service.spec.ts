import { Test, TestingModule } from '@nestjs/testing';
import { CharacteristicService } from './characteristic.service';

describe('CharacteristicService', () => {
  let service: CharacteristicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharacteristicService],
    }).compile();

    service = module.get<CharacteristicService>(CharacteristicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
