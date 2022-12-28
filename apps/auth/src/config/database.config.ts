import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DB_ENTITIES } from '../constants';

export class DatabaseConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      logging: true,
      synchronize: true,
      entities: DB_ENTITIES,
      replication: {
        master: {
          host: process.env.MASTER_DB_HOST,
          port: parseInt(process.env.MASTER_DB_PORT),
          username: process.env.MASTER_DB_USER,
          password: process.env.MASTER_DB_PASS,
          database: process.env.DB_AUTH,
        },
        slaves: [
          {
            host: process.env.SLAVE_DB_HOST,
            port: parseInt(process.env.SLAVE_DB_PORT),
            username: process.env.SLAVE_DB_USER,
            password: process.env.SLAVE_DB_PASS,
            database: process.env.DB_AUTH,
          },
        ],
      },
    };
  }
}
