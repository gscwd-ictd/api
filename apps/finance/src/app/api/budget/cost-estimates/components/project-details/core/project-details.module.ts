import { CrudModule } from '@gscwd-api/crud';
import { ProjectDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { ProjectDetailsController } from './project-details.controller';
import { ProjectDetailsService } from './project-details.service';

@Module({
  imports: [CrudModule.register(ProjectDetails)],
  controllers: [ProjectDetailsController],
  providers: [ProjectDetailsService],
  exports: [ProjectDetailsService],
})
export class ProjectDetailsModule {}
