import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { TrainingDetailsModule } from '../../../core/training-details.module';
import { DocumentsController } from './documents.controller';
import { TrainingNomineesModule } from '../../nominees';
import { TrainingApprovalsModule } from '../../approvals';

@Module({
  imports: [TrainingDetailsModule, TrainingNomineesModule, TrainingApprovalsModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
