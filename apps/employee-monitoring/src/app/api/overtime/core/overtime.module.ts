import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';

@Module({
  providers: [OvertimeService],
  controllers: [OvertimeController]
})
export class OvertimeModule {}
