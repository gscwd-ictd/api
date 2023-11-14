import { Test, TestingModule } from '@nestjs/testing';
import { UserLogsService } from '../core/user-logs.service';

describe('UserLogsService', () => {
  let service: UserLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserLogsService],
    }).compile();

    service = module.get<UserLogsService>(UserLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
