import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../config';
import { CategoryModule } from './item/category';
import { CharacteristicModule } from './item/characteristic';
import { ClassificationModule } from './item/classification/';
import { SpecificationModule } from './item/specification/core/specification.module';
import { UnitModule } from './item/unit/core/unit.module';

@Module({
  imports: [
    // config module for reading enironment variables
    ConfigModule.forRoot({ isGlobal: true }),

    // database connection via typeorm
    TypeOrmModule.forRootAsync({ useClass: DatabaseConfig }),

    // warehouse items
    CharacteristicModule,
    ClassificationModule,
    CategoryModule,
    SpecificationModule,
    UnitModule,
  ],
})
export class AppModule {}
