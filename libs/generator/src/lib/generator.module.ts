import { DynamicModule, Module } from '@nestjs/common';
import { GENERATOR_SERVICE } from '../constants';
import { StringGeneratorOptions } from '../types';
import { GeneratorService } from './generator.service';

@Module({})
export class GeneratorModule {
  static register(options: StringGeneratorOptions): DynamicModule {
    // deconstruct string generator options object
    const { numeric, uppercase, lowercase } = options;

    const myOptions = {
      // assign default values if some fields in the options are undefined
      ...options,

      // default to true if numeric is not defined
      numeric: numeric === undefined ? true : numeric,

      // default to true if lowercase is not defined
      lowercase: lowercase === undefined ? true : lowercase,

      // default to true if uppercase is not defined
      uppercase: uppercase === undefined ? true : uppercase,
    };

    return {
      module: GeneratorModule,
      providers: [
        {
          // define service identifier
          provide: GENERATOR_SERVICE,

          // use myOptions value and pass to generator service
          useValue: myOptions,
        },
        GeneratorService,
      ],
      exports: [GeneratorService],
    };
  }
}
