import { CrudModule } from '@gscwd-api/crud';
import { TrainingNominee } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';
import { TrainingNomineesController } from './training-nominees.controller';
import { TrainingNomineesMicroserviceController } from './training-nominees-ms.controller';
import { HrmsEmployeesModule } from '../../../../../services/hrms';
import { TrainingDistributionsModule } from '../../../../training/components/slot-distributions';
import { TrainingDetailsModule } from '../../../core/training-details.module';
import { TrainingRequirementsModule } from '../../../../training-details/components/training-requirements';

@Module({
  imports: [CrudModule.register(TrainingNominee), HrmsEmployeesModule, TrainingDistributionsModule, TrainingRequirementsModule],
  controllers: [],
  providers: [TrainingNomineesService],
  exports: [TrainingNomineesService],
})
export class TrainingNomineesModule {}
