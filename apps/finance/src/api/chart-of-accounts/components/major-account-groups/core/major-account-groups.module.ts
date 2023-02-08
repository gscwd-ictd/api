import { Module } from '@nestjs/common';
import { MajorAccountGroupsService } from './major-account-groups.service';
import { MajorAccountGroupsController } from './major-account-groups.controller';
import { CrudModule } from '@gscwd-api/crud';
import { MajorAccountGroup } from '../data/major-account-group.entity';

@Module({
  imports: [CrudModule.register(MajorAccountGroup)],
  controllers: [MajorAccountGroupsController],
  providers: [MajorAccountGroupsService],
  exports: [MajorAccountGroupsService],
})
export class MajorAccountGroupsModule {}
