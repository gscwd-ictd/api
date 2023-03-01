import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { PurchaseTypeModule } from '../../core/purchase-type.module';
import { PurchaseTypeStub, UpdatePurchaseTypeDtoStub, PurchaseTypeMutationResult } from './purchase-type.stubs';

let app: INestApplication;
let datasource: DataSource;

describe('PurchaseTypeController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PurchaseTypeModule,
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
  });

  afterAll(async () => {
    const entities = datasource.entityMetadatas;
    await Promise.all(entities.map(async (entity) => await datasource.query(`TRUNCATE ${entity.tableName} CASCADE;`)));
    await datasource.destroy();
    await app.close();
  });

  describe('POST /pr-types', () => {
    it('should create new purchase type', async () => {
      const response = await request(app.getHttpServer()).post('/pr-types').send(PurchaseTypeStub);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(PurchaseTypeStub);
    });
  });

  describe('GET /pr-types', () => {
    it('should return all purchase types', async () => {
      const response = await request(app.getHttpServer()).get('/pr-types');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ items: [PurchaseTypeStub] });
    });
  });

  describe('GET /pr-types/:id', () => {
    it('should return one purchase type matching the id', async () => {
      const response = await request(app.getHttpServer()).get(`/pr-types/${PurchaseTypeStub.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(PurchaseTypeStub);
    });
  });

  describe('PATCH /pr-types/:id', () => {
    it('should update purchase type with the mathing id', async () => {
      const response = await request(app.getHttpServer()).patch(`/pr-types/${PurchaseTypeStub.id}`).send(UpdatePurchaseTypeDtoStub);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(PurchaseTypeMutationResult);
    });
  });

  describe('DELETE /pr-types/:id', () => {
    it('should delete purchase type with the mathching id', async () => {
      const response = await request(app.getHttpServer()).delete(`/pr-types/${PurchaseTypeStub.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(PurchaseTypeMutationResult);
    });
  });
});
