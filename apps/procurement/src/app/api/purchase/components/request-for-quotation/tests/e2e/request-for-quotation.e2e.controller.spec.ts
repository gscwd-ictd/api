import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RequestForQuotationModule } from '../../core/request-for-quotation.module';
import * as request from 'supertest';

let app: INestApplication;
let datasource: DataSource;

describe('RequestForQuotationController', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RequestForQuotationModule,
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

    await datasource.manager.transaction(async (manager) => {
      await manager.query(
        'INSERT INTO "purchase_types" ("created_at", "updated_at", "deleted_at", "purchase_type_id", "type") VALUES (DEFAULT, DEFAULT, DEFAULT, $1, $2)',
        ['a6a69061-7b2f-480c-9a25-2c9c32dc5b68', 'Bidding']
      );

      await manager.query(
        'INSERT INTO "purchase_requests" ("created_at", "updated_at", "deleted_at", "pr_details_id", "code", "account_id", "project_id", "requesting_office", "purpose", "place_of_delivery", "status", "purchase_type_id_fk") VALUES (DEFAULT, DEFAULT, DEFAULT, $1, $2, $3, $4, $5, $6, $7, DEFAULT, $8)',
        [
          '52507044-24c5-43ba-8f85-dc23bfc4efa6',
          'PR-123',
          '2bba9073-a9a5-48ce-b7be-6413947a110f',
          '51d23ae2-82f6-415e-9cb0-ff2d68fc988e',
          '90440de1-f048-11ec-8d31-c4bde5a04065',
          'for office tasks',
          'General Santos Water District',
          'a6a69061-7b2f-480c-9a25-2c9c32dc5b68',
        ]
      );

      await manager.query(
        'INSERT INTO "requested_items" ("created_at", "updated_at", "deleted_at", "requested_item_id", "item_id", "requested_quantity", "remarks", "pr_details_id_fk") VALUES (DEFAULT, DEFAULT, DEFAULT, $1, $2, $3, $4, $5)',
        ['651a6b9d-8096-4e27-85ef-750be90c919c', '722e3788-81ca-4b4d-8881-6a8586de85dd', 3, 'buy this please', '52507044-24c5-43ba-8f85-dc23bfc4efa6']
      );

      await manager.query(
        'INSERT INTO "requested_items" ("created_at", "updated_at", "deleted_at", "requested_item_id", "item_id", "requested_quantity", "remarks", "pr_details_id_fk") VALUES (DEFAULT, DEFAULT, DEFAULT, $1, $2, $3, $4, $5)',
        ['c99b09f6-2f80-4c05-9a69-fa8dc45a78dd', '902b545c-04c4-4331-a9fa-39fefea7f92a', 5, 'buy this please', '52507044-24c5-43ba-8f85-dc23bfc4efa6']
      );
    });
  });

  afterAll(async () => {
    const entities = datasource.entityMetadatas;
    await Promise.all(entities.map(async (entity) => await datasource.query(`TRUNCATE ${entity.tableName} CASCADE;`)));
    await datasource.destroy();
    await app.close();
  });

  describe('POST /rfq', () => {
    it('should create new rfq', async () => {
      const response = await request(app.getHttpServer())
        .post('/rfq')
        .send({
          details: {
            id: '67852474-eb9e-422c-a85b-c9be6ced3e5c',
            purchaseRequest: '52507044-24c5-43ba-8f85-dc23bfc4efa6',
            code: 'RFQ-123',
          },
          items: ['651a6b9d-8096-4e27-85ef-750be90c919c', 'c99b09f6-2f80-4c05-9a69-fa8dc45a78dd'],
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        rfq: {
          id: '67852474-eb9e-422c-a85b-c9be6ced3e5c',
          purchaseRequest: '52507044-24c5-43ba-8f85-dc23bfc4efa6',
          code: 'RFQ-123',
          submitWithin: 7,
          status: 'For Canvass',
        },
      });
    });
  });

  describe('GET /rfq', () => {
    it('should return all requests for quotation', async () => {
      const response = await request(app.getHttpServer()).get('/rfq');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        items: [
          {
            id: '67852474-eb9e-422c-a85b-c9be6ced3e5c',
            code: 'RFQ-123',
            submitWithin: 7,
            status: 'For Canvass',
            purchaseRequest: {
              code: 'PR-123',
              status: 'Pending',
              purchaseType: {
                type: 'Bidding',
              },
            },
          },
        ],
      });
    });
  });

  describe('GET rfq/:id', () => {
    it('should return request for quotation matching id', async () => {
      const response = await request(app.getHttpServer()).get('/rfq/67852474-eb9e-422c-a85b-c9be6ced3e5c');

      expect(response.status).toBe(200);
    });
  });
});
