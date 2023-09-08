import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeAccomplishmentService } from './overtime-accomplishment.service';

describe('OvertimeAccomplishmentService', () => {
  let service: OvertimeAccomplishmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OvertimeAccomplishmentService],
    }).compile();

    service = module.get<OvertimeAccomplishmentService>(OvertimeAccomplishmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
