import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { ProjectDetail } from '../data/project-detail.entity';
import { ProjectDetailController } from './project-detail.controller';
import { ProjectDetailService } from './project-detail.service';

@Module({
  imports: [CrudModule.register(ProjectDetail)],
  providers: [ProjectDetailService],
  controllers: [ProjectDetailController],
  exports: [ProjectDetailService],
})
export class ProjectDetailModule {}
