import { Test, TestingModule } from '@nestjs/testing';
import { SpecificationService } from './specification.service';

describe('SpecificationService', () => {
  let service: SpecificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecificationService],
    }).compile();

    service = module.get<SpecificationService>(SpecificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
