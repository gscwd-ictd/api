import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PurchaseRequestModule } from '../../core/purchase-request.module';
import * as request from 'supertest';
import { CreatePurchaseRequestDtoStub, CreatedPurchaseRequestStub, PurchaseRequestStub, PurchaseRequestInfoStub } from './purchase-request.stubs';

let app: INestApplication;
let datasource: DataSource;

describe('PurchaseRequestController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PurchaseRequestModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: '10.10.1.5',
          port: 5432,
          username: 'postgres',
          password: 'password',
          database: 'e2e_test',
          entities: ['./libs/models/src/lib/databases/procurement/data/**/*.entity.ts'],
          synchronize: true,
        }),
      ],
    }).compile();

    app = await module.createNestApplication().init();

    datasource = app.get(DataSource);

    // insert dummy purchase type
    await datasource.query(
      'INSERT INTO "purchase_types" ("created_at", "updated_at", "deleted_at", "purchase_type_id", "type") VALUES (DEFAULT, DEFAULT, DEFAULT, $1, $2)',
      ['92ee26a8-926e-4c37-8f9c-e7d596bd2ed1', 'Direct Purchase']
    );
  });

  afterAll(async () => {
    const entities = datasource.entityMetadatas;
    await Promise.all(entities.map(async (entity) => await datasource.query(`TRUNCATE ${entity.tableName} CASCADE;`)));
    await datasource.destroy();
    await app.close();
  });

  describe('POST /pr', () => {
    it('should create new purchase request', async () => {
      // perform post request
      const response = await request(app.getHttpServer()).post('/pr').send(CreatePurchaseRequestDtoStub);

      // assert values
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(CreatedPurchaseRequestStub);
    });
  });

  describe('GET /pr', () => {
    it('should return all purchase requests', async () => {
      const response = await request(app.getHttpServer()).get('/pr');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ items: [PurchaseRequestStub] });
    });
  });

  describe('GET /pr/:id', () => {
    it('should return one purchase request matching the id', async () => {
      const response = await request(app.getHttpServer()).get(`/pr/${PurchaseRequestStub.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(PurchaseRequestInfoStub);
    });
  });
});
