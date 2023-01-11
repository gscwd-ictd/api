import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class DatabaseConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      logging: true,
      synchronize: true,
      host: process.env.SLAVE_DB_HOST,
      port: parseInt(process.env.SLAVE_DB_PORT),
      username: process.env.SLAVE_DB_USER,
      password: process.env.SLAVE_DB_PASS,
      database: process.env.DB_IMS,
    };
  }
}
