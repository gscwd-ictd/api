import { Test, TestingModule } from '@nestjs/testing';
import { LeaveAddBackService } from '../core/leave-add-back.service';

describe('LeaveAddBackService', () => {
  let service: LeaveAddBackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveAddBackService],
    }).compile();

    service = module.get<LeaveAddBackService>(LeaveAddBackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
