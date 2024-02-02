import { Module } from '@nestjs/common';
import { EmsSettingsController } from './ems-settings.controller';
import { EmsSettingsService } from './ems-settings.service';
import { CrudModule } from '@gscwd-api/crud';
import { EmsSettings } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(EmsSettings)],
  controllers: [EmsSettingsController],
  providers: [EmsSettingsService],
  exports: [EmsSettingsService],
})
export class EmsSettingsModule {}
