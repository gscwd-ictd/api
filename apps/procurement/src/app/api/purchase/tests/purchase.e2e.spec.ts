import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PurchaseRequestModule } from '../components/purchase-request/core/purchase-request.module';
import { init } from '../../../../connections/database/constants/queries';
import * as request from 'supertest';
import { CreatePurchaseTypeDtoStub, CreatePrDtoStub, PurchaseTypeStub, PurchaseRequestStub, RequestedForQuotationStub } from './purchase.stubs';
import { PurchaseType, RequestedItem, RequestForQuotation } from '@gscwd-api/models';
import { PurchaseTypeModule } from '../components/purchase-type/core/purchase-type.module';
import { PurchaseRequest } from '@gscwd-api/utils';
import { RequestForQuotationModule } from '../components/request-for-quotation/core/request-for-quotation.module';
import { RequestedItemModule } from '../../../api/purchase/components/requested-item';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

let app: INestApplication;
let datasource: DataSource;
// let client: ClientProxy;

describe('Purchase Module e2e test', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PurchaseRequestModule,
        PurchaseTypeModule,
        RequestForQuotationModule,
        RequestedItemModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '../../../../../../../test/.env') }),
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
      // providers: [
      //   {
      //     provide: MS_CLIENT,
      //     useValue: { transport: Transport.REDIS },
      //   },
      //   MicroserviceClient,
      // ],
    }).compile();

    app = module.createNestApplication();
    // app.connectMicroservice({ transport: Transport.REDIS });

    // await app.startAllMicroservices();
    await app.init();

    // client = app.get(MS_CLIENT);
    // await client.connect();

    datasource = app.get(DataSource);

    // initialize code_generator()
    await datasource.query(init.code_generator);

    // initialize get_month()
    await datasource.query(init.get_month);

    // initialize json_rename_attribute()
    await datasource.query(init.jsonb_rename_attribute);

    // initialize jsonb_rename_attribute_in_array
    await datasource.query(init.jsonb_rename_attribute_in_array);

    // initialize util_pr_code_seq table
    await datasource.query(init.util_pr_code_seq);

    // initialize generate_pr_code() function
    await datasource.query(init.generate_pr_code);

    // initialize create_pr() function
    await datasource.query(init.create_pr);

    // initialize util_rfq_code_seq table
    await datasource.query(init.util_rfq_code_seq);

    // initialize generate_rfq_code() function
    await datasource.query(init.generate_rfq_code);

    // initialize create_rfq() function
    await datasource.query(init.create_rfq);
  });

  afterAll(async () => {
    const entities = datasource.entityMetadatas;
    await Promise.all([
      ...entities.map(async (entity) => await datasource.query(`TRUNCATE ${entity.tableName} CASCADE;`)),
      await datasource.query(`UPDATE util_pr_code_seq SET curr_year = date_part('year', CURRENT_DATE), curr_val = 0;`),
      await datasource.query(`UPDATE util_rfq_code_seq SET curr_year = date_part('year', CURRENT_DATE), curr_val = 0;`),
    ]);
    await datasource.destroy();
    await app.close();
  });

  describe('Purchase Flow', () => {
    let prType = {} as PurchaseType;
    let pr = {} as PurchaseRequest;
    let rfq = {} as RequestForQuotation;
    let requestedItems = [] as RequestedItem[];

    it('should create new purchase type', async () => {
      const response = await request(app.getHttpServer()).post('/pr-types').send(CreatePurchaseTypeDtoStub);
      prType = response.body;

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(PurchaseTypeStub);
    });

    it('should create new purchase request', async () => {
      // perform post request
      const response = await request(app.getHttpServer())
        .post('/pr')
        .send({ ...CreatePrDtoStub, details: { ...CreatePrDtoStub.details, purchaseType: prType.id } });

      pr = response.body;

      // assert returned values
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(PurchaseRequestStub);
    });

    it('should get all created purchase requests', async () => {
      const response = await request(app.getHttpServer()).get('/pr');

      expect(response.status).toBe(200);
    });

    it('should get purchase request details based on id', async () => {
      const response = await request(app.getHttpServer()).get(`/pr/${pr.id}`);

      expect(response.status).toBe(200);
    });

    it('should find all the requested items from purchase request', async () => {
      const response = await request(app.getHttpServer()).get('/requested-items/pr/').query({ id: pr.id });

      requestedItems = response.body;

      expect(response.status).toBe(200);
    });

    it('should create new request for quotation from purchase request', async () => {
      const items = await Promise.all(requestedItems.map(async (item) => ({ itemId: item.id })));

      const response = await request(app.getHttpServer()).post('/rfq').send({ prId: pr.id, items });

      rfq = response.body;

      // assert returned values
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(RequestedForQuotationStub);
    });

    it('should find all requests for quotation', async () => {
      const response = await request(app.getHttpServer()).get('/rfq');

      expect(response.status).toBe(200);
    });

    it('should get details of rfq based on id', async () => {
      const response = await request(app.getHttpServer()).get(`/rfq/${rfq.id}`);

      expect(response.status).toBe(200);
    });
  });
});
