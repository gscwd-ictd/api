import { Controller } from '@nestjs/common';
import { ZTestService } from './z_test.service';

@Controller('z-test')
export class ZTestController {
  constructor(private readonly testService: ZTestService) {}
}
