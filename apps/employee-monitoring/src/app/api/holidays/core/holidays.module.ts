import { CrudModule } from '@gscwd-api/crud';
import { Holidays } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { HolidaysMsController } from './holidays-ms.controller';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';

@Module({
  imports: [CrudModule.register(Holidays)],
  providers: [HolidaysService],
  controllers: [HolidaysController, HolidaysMsController],
  exports: [HolidaysService],
})
export class HolidaysModule {}
