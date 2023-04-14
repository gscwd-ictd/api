import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { DatabaseModule } from '../connections/';
import { PurchaseRequestModule, RequestForQuotationModule, PurchaseTypeModule, RequestedItemModule } from './api/purchase/components';
import { CostEstimateModule, ItemsModule, OrgStructureModule } from './services';

@Module({
  imports: [
    // config module setup for reading env variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../.env'),
    }),

    // initialize database connection
    DatabaseModule,

    // api modules
    PurchaseRequestModule,
    RequestForQuotationModule,
    PurchaseTypeModule,
    RequestedItemModule,

    // microservice modules
    OrgStructureModule,
    ItemsModule,
    CostEstimateModule,
  ],
})
export class AppModule {}
