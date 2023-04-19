import { CrudModule } from '@gscwd-api/crud';
import { ProjectDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { ProjectDetailsController } from './project-details.controller';
import { ProjectDetailsService } from './project-details.service';
import { ProjectDetailsMicroserviceController } from './project-details-ms.controller';

@Module({
  imports: [CrudModule.register(ProjectDetails)],
  controllers: [ProjectDetailsController, ProjectDetailsMicroserviceController],
  providers: [ProjectDetailsService],
  exports: [ProjectDetailsService],
})
export class ProjectDetailsModule {}
