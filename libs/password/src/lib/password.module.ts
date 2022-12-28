import { DynamicModule, Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { Argon2AsyncOptions, Argon2Options, PASSWORD_SERVICE } from './password.utils';

@Module({})
export class PasswordModule {
  static register(options: Argon2Options): DynamicModule {
    return {
      module: PasswordModule,
      providers: [
        {
          provide: PASSWORD_SERVICE,
          useValue: options,
        },
        PasswordService,
      ],
      exports: [PasswordService],
    };
  }

  static registerAsync(options: Argon2AsyncOptions): DynamicModule {
    return {
      module: PasswordModule,
      providers: [
        {
          provide: PASSWORD_SERVICE,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        PasswordService,
      ],
      exports: [PasswordService],
    };
  }
}
