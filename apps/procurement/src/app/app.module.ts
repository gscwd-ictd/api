import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections';
import { PurchaseRequestModule, RequestForQuotationModule, PurchaseTypeModule } from './api/purchase/components';
import { SuppliersModule } from './api/suppliers/core/suppliers.module';
import { OrgStructureModule } from './services/hrms/components/org-structure';
import { ItemsModule } from './services/items';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../apps/procurement/.env') }),

    DatabaseModule,

    // api modules
    PurchaseRequestModule,
    RequestForQuotationModule,
    PurchaseTypeModule,
    SuppliersModule,

    // microservice modules
    OrgStructureModule,
    ItemsModule,
  ],
})
export class AppModule {}
