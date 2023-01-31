import { ItemCharacteristic } from '@gscwd-api/models';
import { CrudModule, CrudService } from '@gscwd-api/crud';
import { GeneratorModule, GeneratorService } from '@gscwd-api/generator';
import { Test, TestingModule } from '@nestjs/testing';
import { CharacteristicsController } from '../core/characteristics.controller';
import { CharacteristicsService } from '../core/characteristics.service';

const mockCharService = {};
const mockGenService = {} as GeneratorService;
const crudService = {} as CrudService<ItemCharacteristic>;

describe('CharacteristicsController', () => {
  let controller: CharacteristicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrudModule.register(ItemCharacteristic), GeneratorModule.register({ length: 3, lowercase: false })],
      controllers: [CharacteristicsController],
      providers: [CharacteristicsService, GeneratorService],
    })
      .overrideProvider([CharacteristicsService, GeneratorService, CrudService<ItemCharacteristic>])
      .useValue([mockCharService, mockGenService, crudService])
      .compile();

    controller = module.get<CharacteristicsController>(CharacteristicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new charcteristic', () => {
    expect(controller.create({ code: 'PHY', name: 'Physical', description: 'test' })).toEqual({
      id: expect.any(String),
      code: expect.any(String),
      name: 'Physical',
      description: 'test',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      deletedAt: expect.any(Date),
    });
  });
});
