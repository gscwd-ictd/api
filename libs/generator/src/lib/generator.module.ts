import { DynamicModule, Module } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GENERATOR_SERVICE, StringGeneratorOptions } from './generator.utils';

@Module({})
export class GeneratorModule {
  static register(options: StringGeneratorOptions): DynamicModule {
    const { numeric, uppercase, lowercase } = options;

    const myOptions = {
      ...options,
      numeric: numeric === undefined ? true : numeric,
      lowercase: lowercase === undefined ? true : lowercase,
      uppercase: uppercase === undefined ? true : uppercase,
    };

    return {
      module: GeneratorModule,
      providers: [
        {
          provide: GENERATOR_SERVICE,
          useValue: myOptions,
        },
        GeneratorService,
      ],
      exports: [GeneratorService],
    };
  }
}
