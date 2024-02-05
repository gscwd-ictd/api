import { Test, TestingModule } from '@nestjs/testing';
import { EmsSettingsService } from '../core/ems-settings.service';

describe('EmsSettingsService', () => {
  let service: EmsSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmsSettingsService],
    }).compile();

    service = module.get<EmsSettingsService>(EmsSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
