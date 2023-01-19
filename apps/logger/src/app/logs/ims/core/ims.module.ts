import { Module } from '@nestjs/common';
import { ImsService } from './ims.service';
import { ImsController } from './ims.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ImsLogs } from '../data/ims.entity';

@Module({
  imports: [CrudModule.register(ImsLogs)],
  providers: [ImsService],
  controllers: [ImsController],
})
export class ImsModule {}
