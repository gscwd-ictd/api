import { Test, TestingModule } from '@nestjs/testing';
import { DetailsService } from './details.service';

describe('DetailsService', () => {
  let service: DetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailsService],
    }).compile();

    service = module.get<DetailsService>(DetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
