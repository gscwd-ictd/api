import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_ENTITIES } from '../constants/entities';
import { Environment } from '../constants/environments';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        logging: true,
        synchronize: true,
        entities: DB_ENTITIES,
        replication: {
          master: {
            host: configService.getOrThrow<string>(Environment.MASTER_DB_HOST),
            port: parseInt(configService.getOrThrow<string>(Environment.MASTER_DB_PORT)),
            username: configService.getOrThrow<string>(Environment.MASTER_DB_USER),
            password: configService.getOrThrow<string>(Environment.MASTER_DB_PASS),
            database: configService.getOrThrow<string>(Environment.DB_ITEMS),
          },
          slaves: [
            {
              host: configService.getOrThrow<string>(Environment.SLAVE_DB_HOST),
              port: parseInt(configService.getOrThrow<string>(Environment.SLAVE_DB_PORT)),
              username: configService.getOrThrow<string>(Environment.SLAVE_DB_USER),
              password: configService.getOrThrow<string>(Environment.SLAVE_DB_PASS),
              database: configService.getOrThrow<string>(Environment.DB_ITEMS),
            },
          ],
        },
      }),
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
