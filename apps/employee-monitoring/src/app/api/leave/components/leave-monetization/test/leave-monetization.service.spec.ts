import { Test, TestingModule } from '@nestjs/testing';
import { LeaveMonetizationService } from './leave-monetization.service';

describe('LeaveMonetizationService', () => {
  let service: LeaveMonetizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveMonetizationService],
    }).compile();

    service = module.get<LeaveMonetizationService>(LeaveMonetizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
