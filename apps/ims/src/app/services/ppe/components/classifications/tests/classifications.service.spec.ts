import { Test, TestingModule } from '@nestjs/testing';
import { PpeClassificationsService } from '../core/classifications.service';

describe('ClassificationsService', () => {
  let service: PpeClassificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PpeClassificationsService],
    }).compile();

    service = module.get<PpeClassificationsService>(PpeClassificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
