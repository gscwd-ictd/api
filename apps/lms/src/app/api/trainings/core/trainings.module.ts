import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { CrudModule } from '@gscwd-api/crud';
import { Training } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(Training)],
  controllers: [],
  providers: [TrainingsService],
  exports: [TrainingsService],
})
export class TrainingsModule {}
