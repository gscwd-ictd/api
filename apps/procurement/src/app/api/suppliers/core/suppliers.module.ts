import { CrudModule } from '@gscwd-api/crud';
import { Supplier } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';

@Module({
  imports: [CrudModule.register(Supplier)],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
