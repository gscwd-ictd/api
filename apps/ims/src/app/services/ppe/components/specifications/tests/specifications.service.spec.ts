import { Test, TestingModule } from '@nestjs/testing';
import { PpeSpecificationsService } from '../core/specifications.service';

describe('SpecificationsService', () => {
  let service: PpeSpecificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PpeSpecificationsService],
    }).compile();

    service = module.get<PpeSpecificationsService>(PpeSpecificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
