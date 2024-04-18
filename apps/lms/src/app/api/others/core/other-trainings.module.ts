import { CrudModule } from '@gscwd-api/crud';
import { OtherTraining } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { OtherTrainingsService } from './other-trainings.service';
import { OtherTrainingsController } from './other-trainings.controller';

@Module({
  imports: [CrudModule.register(OtherTraining)],
  controllers: [OtherTrainingsController],
  providers: [OtherTrainingsService],
  exports: [OtherTrainingsService],
})
export class OtherTrainingsModule {}
