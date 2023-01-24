import { PpeDetailsView } from '@gscwd-api/app-entities';
import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { PpeCategoriesModule, PpeClassificationsModule, PpeSpecificationsModule } from '../components';
import { PpeController } from './ppe.controller';
import { PpeService } from './ppe.service';

@Module({
  imports: [
    // crud module
    CrudModule.register(PpeDetailsView),
    PpeClassificationsModule,
    PpeCategoriesModule,
    PpeSpecificationsModule,
  ],
  controllers: [PpeController],
  providers: [PpeService],
})
export class PpeModule {}
