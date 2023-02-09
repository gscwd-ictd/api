import { Module } from '@nestjs/common';
import { SubMajorAccountGroupService } from './sub-major-account-groups.service';
import { SubMajorAccountGroupController } from './sub-major-account-groups.controller';
import { CrudModule } from '@gscwd-api/crud';
import { SubMajorAccountGroup } from '../data/sub-major-account-groups.entity';

@Module({
  imports: [CrudModule.register(SubMajorAccountGroup)],
  controllers: [SubMajorAccountGroupController],
  providers: [SubMajorAccountGroupService],
  exports: [SubMajorAccountGroupService],
})
export class SubMajorAccountGroupModule {}
