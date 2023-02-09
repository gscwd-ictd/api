import { Module } from '@nestjs/common';
import { MajorAccountGroupService } from './major-account-groups.service';
import { MajorAccountGroupController } from './major-account-groups.controller';
import { CrudModule } from '@gscwd-api/crud';
import { MajorAccountGroup } from '../data/major-account-groups.entity';

@Module({
  imports: [CrudModule.register(MajorAccountGroup)],
  controllers: [MajorAccountGroupController],
  providers: [MajorAccountGroupService],
  exports: [MajorAccountGroupService],
})
export class MajorAccountGroupModule {}
