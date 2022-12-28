import { DynamicModule, Module } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { CrudService } from './crud.service';
import { CRUD_SERVICE } from './crud.utils';

@Module({})
export class CrudModule {
  public static register<T>(entity: EntityTarget<T>): DynamicModule {
    return {
      module: CrudModule,

      // make the scope of this module as local only
      global: false,

      // set the dependencies for this module
      providers: [
        {
          // create a custom crud service
          provide: CRUD_SERVICE,

          // return the entity value to be used by crud service
          useValue: entity,
        },
        CrudService,
      ],
      exports: [CrudService],
    };
  }
}
